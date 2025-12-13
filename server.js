const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Oracle Database Configuration
const dbConfig = {
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    connectString: process.env.DB_CONNECTION_STRING || 'localhost:1521/XE',
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
};

// Initialize Oracle connection pool
let pool;

async function initializePool() {
    try {
        pool = await oracledb.createPool(dbConfig);
        console.log('Oracle connection pool created successfully');
    } catch (err) {
        console.error('Error creating Oracle connection pool:', err);
        process.exit(1);
    }
}

// Helper function to execute queries
async function executeQuery(sql, binds = [], options = {}) {
    if (!pool) {
        throw new Error('Database connection pool not initialized');
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true,
            ...options
        });
        return result.rows || result;
    } catch (err) {
        console.error('Database query error:', err);
        console.error('SQL:', sql);
        console.error('Binds:', binds);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== USER/AUTHENTICATION ROUTES ====================

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const sql = 'SELECT * FROM buyer UNION ALL SELECT buyer_id as id, name, phone, email, address, city, state, zip_code, NULL as budget_min, NULL as budget_max, NULL as preferred_bedrooms, NULL as preferred_bathrooms, NULL as registration_date FROM seller';
        // For now, we'll use a simpler approach - get buyers and agents separately
        const buyers = await executeQuery('SELECT * FROM buyer');
        const agents = await executeQuery('SELECT agent_id as id, name, phone, email, NULL as address, NULL as city, NULL as state, NULL as zip_code, NULL as budget_min, NULL as budget_max, NULL as preferred_bedrooms, NULL as preferred_bathrooms, NULL as registration_date, account_type FROM agent');
        
        // Combine and format
        const users = [
            ...buyers.map(b => ({ ...b, accountType: 'buyer' })),
            ...agents.map(a => ({ ...a, accountType: 'realtor', id: a.id || a.agent_id }))
        ];
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create user (sign up)
app.post('/api/users/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);
        const { accountType, name, email, phone, password, ...otherData } = req.body;
        
        if (!accountType || !name || !email || !phone) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        if (accountType === 'realtor') {
            const agentId = 'A' + Date.now().toString().slice(-9);
            const sql = `INSERT INTO agent (agent_id, name, phone, email, license_number, commission_rate, hire_date, account_type)
                         VALUES (:agent_id, :name, :phone, :email, :license_number, :commission_rate, SYSDATE, 'realtor')`;
            
            // Generate unique license number if not provided
            const licenseNumber = otherData.licenseNumber && otherData.licenseNumber.trim() 
                ? otherData.licenseNumber.trim() 
                : 'LIC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
            
            const binds = {
                agent_id: agentId,
                name: name.trim(),
                phone: phone.trim() || null,
                email: email.trim().toLowerCase(),
                license_number: licenseNumber,
                commission_rate: parseFloat(otherData.commissionRate) || 0
            };
            
            console.log('Inserting agent with ID:', agentId);
            console.log('Agent data:', binds);
            
            await executeQuery(sql, binds);
            
            // Verify the agent was inserted
            const verifySql = 'SELECT agent_id, name, email FROM agent WHERE agent_id = :agent_id';
            const verifyResult = await executeQuery(verifySql, { agent_id: agentId });
            console.log('Verification query result:', verifyResult);
            
            if (verifyResult.length === 0) {
                throw new Error('Agent was not inserted successfully');
            }
            
            console.log('Agent successfully created:', agentId);
            res.json({ success: true, user: { id: agentId, accountType: 'realtor', name, email, phone } });
        } else {
            const buyerId = 'B' + Date.now().toString().slice(-9);
            const sql = `INSERT INTO buyer (buyer_id, name, phone, email, address, city, state, zip_code, 
                         budget_min, budget_max, preferred_bedrooms, preferred_bathrooms, registration_date, account_type)
                         VALUES (:buyer_id, :name, :phone, :email, :address, :city, :state, :zip_code,
                         :budget_min, :budget_max, :preferred_bedrooms, :preferred_bathrooms, SYSDATE, 'buyer')`;
            await executeQuery(sql, {
                buyer_id: buyerId,
                name: name.trim(),
                phone: phone.trim() || null,
                email: email.trim().toLowerCase(),
                address: (otherData.address || '').trim(),
                city: (otherData.city || '').trim(),
                state: (otherData.state || '').trim(),
                zip_code: (otherData.zipCode || '').trim(),
                budget_min: parseFloat(otherData.budgetMin) || 0,
                budget_max: parseFloat(otherData.budgetMax) || 0,
                preferred_bedrooms: parseInt(otherData.preferredBedrooms) || 0,
                preferred_bathrooms: parseFloat(otherData.preferredBathrooms) || 0
            });
            res.json({ success: true, user: { id: buyerId, accountType: 'buyer', name, email, phone } });
        }
    } catch (err) {
        console.error('Signup error:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Sign in
app.post('/api/users/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Sign-in attempt for email:', email);
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        // Check buyers - use UPPER for case-insensitive comparison
        const normalizedEmail = email.trim().toLowerCase();
        let sql = 'SELECT buyer_id as id, name, phone, email, account_type FROM buyer WHERE UPPER(email) = UPPER(:email)';
        let result = await executeQuery(sql, { email: normalizedEmail });
        
        console.log('Buyer query result:', result.length, 'records found');
        
        if (result.length > 0) {
            const user = result[0];
            // Note: We're not checking password since we don't store it in the database
            // In a real application, you would hash and compare passwords here
            const userData = {
                id: user.ID || user.id || user.BUYER_ID || user.buyer_id,
                name: user.NAME || user.name,
                phone: user.PHONE || user.phone,
                email: user.EMAIL || user.email,
                accountType: user.ACCOUNT_TYPE || user.account_type || 'buyer'
            };
            console.log('Sign-in successful for buyer:', userData.email);
            return res.json({ success: true, user: userData });
        }
        
        // Check agents - use UPPER for case-insensitive comparison
        sql = 'SELECT agent_id as id, name, phone, email, account_type FROM agent WHERE UPPER(email) = UPPER(:email)';
        result = await executeQuery(sql, { email: normalizedEmail });
        
        console.log('Agent query result:', result.length, 'records found');
        
        if (result.length > 0) {
            const user = result[0];
            // Note: We're not checking password since we don't store it in the database
            // In a real application, you would hash and compare passwords here
            const userData = {
                id: user.ID || user.id || user.AGENT_ID || user.agent_id,
                name: user.NAME || user.name,
                phone: user.PHONE || user.phone,
                email: user.EMAIL || user.email,
                accountType: user.ACCOUNT_TYPE || user.account_type || 'realtor'
            };
            console.log('Sign-in successful for agent:', userData.email);
            return res.json({ success: true, user: userData });
        }
        
        console.log('Sign-in failed: No user found with email:', email);
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    } catch (err) {
        console.error('Sign-in error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        // Determine if agent or buyer
        if (userId.startsWith('A')) {
            // Update agent
            const sql = `UPDATE agent SET name = :name, phone = :phone, email = :email
                         WHERE agent_id = :agent_id`;
            await executeQuery(sql, {
                agent_id: userId,
                name: updateData.name,
                phone: updateData.phone,
                email: updateData.email
            });
            const result = await executeQuery('SELECT agent_id as id, name, phone, email FROM agent WHERE agent_id = :agent_id', { agent_id: userId });
            res.json({ success: true, user: { ...result[0], accountType: 'realtor' } });
        } else {
            // Update buyer
            const sql = `UPDATE buyer SET name = :name, phone = :phone, email = :email,
                         budget_min = :budget_min, budget_max = :budget_max,
                         preferred_bedrooms = :preferred_bedrooms, preferred_bathrooms = :preferred_bathrooms
                         WHERE buyer_id = :buyer_id`;
            await executeQuery(sql, {
                buyer_id: userId,
                name: updateData.name,
                phone: updateData.phone,
                email: updateData.email,
                budget_min: updateData.budgetMin || 0,
                budget_max: updateData.budgetMax || 0,
                preferred_bedrooms: updateData.preferredBedrooms || 0,
                preferred_bathrooms: updateData.preferredBathrooms || 0
            });
            const result = await executeQuery('SELECT buyer_id as id, name, phone, email FROM buyer WHERE buyer_id = :buyer_id', { buyer_id: userId });
            res.json({ success: true, user: { ...result[0], accountType: 'buyer' } });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==================== PROPERTY ROUTES ====================

// Get all properties with filters
app.get('/api/properties', async (req, res) => {
    try {
        // Extract filter parameters from query string
        const {
            search,
            priceMin,
            priceMax,
            bedrooms,
            bathrooms,
            propertyType,
            status,
            city,
            state,
            zipCode,
            listingType
        } = req.query;
        
        // Build dynamic SQL query with filters
        let sql = `SELECT p.*, pt.type_name as property_type, 
                   a.name as agent_name, a.phone as agent_phone, a.email as agent_email
                   FROM property p
                   LEFT JOIN property_type pt ON p.property_type_id = pt.type_id
                   LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
                   WHERE 1=1`;
        
        const binds = {};
        
        // Search filter (address, city, state, zip, description)
        if (search) {
            sql += ` AND (UPPER(p.address) LIKE UPPER(:search) 
                    OR UPPER(p.city) LIKE UPPER(:search) 
                    OR UPPER(p.state) LIKE UPPER(:search) 
                    OR UPPER(p.zip_code) LIKE UPPER(:search)
                    OR UPPER(p.description) LIKE UPPER(:search))`;
            binds.search = `%${search}%`;
        }
        
        // Price filter
        if (priceMin) {
            sql += ` AND p.listing_price >= :priceMin`;
            binds.priceMin = parseFloat(priceMin);
        }
        if (priceMax) {
            sql += ` AND p.listing_price <= :priceMax`;
            binds.priceMax = parseFloat(priceMax);
        }
        
        // Bedrooms filter
        if (bedrooms) {
            sql += ` AND p.bedrooms >= :bedrooms`;
            binds.bedrooms = parseInt(bedrooms);
        }
        
        // Bathrooms filter
        if (bathrooms) {
            sql += ` AND p.bathrooms >= :bathrooms`;
            binds.bathrooms = parseFloat(bathrooms);
        }
        
        // Property type filter
        if (propertyType) {
            sql += ` AND pt.type_name = :propertyType`;
            binds.propertyType = propertyType;
        }
        
        // Status filter
        if (status) {
            sql += ` AND p.status = :status`;
            binds.status = status;
        }
        
        // City filter
        if (city) {
            sql += ` AND UPPER(p.city) = UPPER(:city)`;
            binds.city = city;
        }
        
        // State filter
        if (state) {
            sql += ` AND UPPER(p.state) = UPPER(:state)`;
            binds.state = state;
        }
        
        // ZIP code filter
        if (zipCode) {
            sql += ` AND p.zip_code = :zipCode`;
            binds.zipCode = zipCode;
        }
        
        // Listing type filter (Sale or Rent)
        if (listingType) {
            sql += ` AND p.listing_type = :listingType`;
            binds.listingType = listingType;
        }
        
        // Order by listing date
        sql += ` ORDER BY p.listing_date DESC`;
        
        console.log('Executing SQL:', sql);
        console.log('With binds:', binds);
        
        const properties = await executeQuery(sql, binds);
        console.log(`Found ${properties.length} properties`);
        
        // Get features for each property
        for (let prop of properties) {
            try {
                const featuresSql = 'SELECT feature_name FROM property_feature WHERE property_id = :property_id';
                const features = await executeQuery(featuresSql, { property_id: prop.PROPERTY_ID });
                prop.features = features.map(f => f.FEATURE_NAME || f.feature_name);
            } catch (err) {
                console.error('Error fetching features for property:', prop.PROPERTY_ID, err);
                prop.features = [];
            }
            
            prop.agent = {
                name: prop.AGENT_NAME || prop.agent_name,
                phone: prop.AGENT_PHONE || prop.agent_phone,
                email: prop.AGENT_EMAIL || prop.agent_email
            };
        }
        
        res.json(properties);
    } catch (err) {
        console.error('Error fetching properties:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
    try {
        const sql = `SELECT p.*, pt.type_name as property_type,
                     a.name as agent_name, a.phone as agent_phone, a.email as agent_email
                     FROM property p
                     LEFT JOIN property_type pt ON p.property_type_id = pt.type_id
                     LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
                     WHERE p.property_id = :property_id`;
        const result = await executeQuery(sql, { property_id: req.params.id });
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        const property = result[0];
        const featuresSql = 'SELECT feature_name FROM property_feature WHERE property_id = :property_id';
        const features = await executeQuery(featuresSql, { property_id: req.params.id });
        property.features = features.map(f => f.FEATURE_NAME);
        property.agent = {
            name: property.AGENT_NAME,
            phone: property.AGENT_PHONE,
            email: property.AGENT_EMAIL
        };
        
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create property
app.post('/api/properties', upload.single('image'), async (req, res) => {
    try {
        const property = req.body;
        const propertyId = 'P' + Date.now().toString().slice(-9);
        
        // Convert image to base64 if uploaded
        let imageData = null;
        if (req.file) {
            imageData = req.file.buffer.toString('base64');
        }
        
        const sql = `INSERT INTO property (property_id, address, city, state, zip_code, property_type_id,
                     bedrooms, bathrooms, square_feet, lot_size, year_built, listing_price, listing_type, status,
                     listing_date, description, seller_id, listing_agent_id)
                     VALUES (:property_id, :address, :city, :state, :zip_code, :property_type_id,
                     :bedrooms, :bathrooms, :square_feet, :lot_size, :year_built, :listing_price, :listing_type, 'On Market',
                     SYSDATE, :description, :seller_id, :listing_agent_id)`;
        
        await executeQuery(sql, {
            property_id: propertyId,
            address: property.address,
            city: property.city,
            state: property.state,
            zip_code: property.zip_code,
            property_type_id: property.property_type_id,
            bedrooms: parseInt(property.bedrooms),
            bathrooms: parseFloat(property.bathrooms),
            square_feet: parseInt(property.square_feet),
            lot_size: parseFloat(property.lot_size),
            year_built: parseInt(property.year_built),
            listing_price: parseFloat(property.listing_price),
            listing_type: property.listing_type || 'Sale',
            description: property.description,
            seller_id: property.seller_id,
            listing_agent_id: property.listing_agent_id
        });
        
        // Insert features
        if (property.features && property.features.length > 0) {
            for (const feature of property.features) {
                const featureSql = 'INSERT INTO property_feature (property_id, feature_name) VALUES (:property_id, :feature_name)';
                await executeQuery(featureSql, { property_id: propertyId, feature_name: feature });
            }
        }
        
        res.json({ success: true, property_id: propertyId, image_url: imageData });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==================== AGENT ROUTES ====================

// Get all agents
app.get('/api/agents', async (req, res) => {
    try {
        const sql = 'SELECT * FROM agent ORDER BY name';
        const agents = await executeQuery(sql);
        console.log(`Agent finder: Found ${agents.length} agents`);
        res.json(agents);
    } catch (err) {
        console.error('Error fetching agents:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== START SERVER ====================

async function startServer() {
    await initializePool();
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Make sure Oracle database is running and configured in .env file`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    if (pool) {
        await pool.close();
        console.log('Oracle connection pool closed');
    }
    process.exit(0);
});

startServer().catch(console.error);

