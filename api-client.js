// API Client for Oracle Database Backend
// Replace localStorage functions with API calls

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('API Call:', url, options.method || 'GET');
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            let errorMessage = 'API request failed';
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // If it's a network error (failed to fetch), provide a more helpful message
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Cannot connect to server. Make sure the server is running on http://localhost:3000');
        }
        throw error;
    }
}

// ==================== USER/AUTHENTICATION API ====================

async function getUsers() {
    try {
        return await apiCall('/users');
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}

async function signUp(userData) {
    try {
        const result = await apiCall('/users/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function signIn(email, password) {
    try {
        const result = await apiCall('/users/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function updateUser(userId, updateData) {
    try {
        const result = await apiCall(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== PROPERTY API ====================

async function getProperties(filters = {}) {
    try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
        if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);
        if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
        if (filters.bathrooms) queryParams.append('bathrooms', filters.bathrooms);
        if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.state) queryParams.append('state', filters.state);
        if (filters.zipCode) queryParams.append('zipCode', filters.zipCode);
        if (filters.listingType) queryParams.append('listingType', filters.listingType);
        
        const queryString = queryParams.toString();
        const endpoint = queryString ? `/properties?${queryString}` : '/properties';
        
        const properties = await apiCall(endpoint);
        // Transform Oracle column names to camelCase
        return properties.map(prop => ({
            property_id: prop.PROPERTY_ID || prop.property_id,
            address: prop.ADDRESS || prop.address,
            city: prop.CITY || prop.city,
            state: prop.STATE || prop.state,
            zip_code: prop.ZIP_CODE || prop.zip_code,
            property_type: prop.PROPERTY_TYPE || prop.property_type || prop.PROPERTY_TYPE_NAME,
            bedrooms: prop.BEDROOMS || prop.bedrooms,
            bathrooms: prop.BATHROOMS || prop.bathrooms,
            square_feet: prop.SQUARE_FEET || prop.square_feet,
            lot_size: prop.LOT_SIZE || prop.lot_size,
            year_built: prop.YEAR_BUILT || prop.year_built,
            listing_price: prop.LISTING_PRICE || prop.listing_price,
            listing_type: prop.LISTING_TYPE || prop.listing_type || 'Sale',
            status: prop.STATUS || prop.status,
            listing_date: prop.LISTING_DATE || prop.listing_date,
            description: prop.DESCRIPTION || prop.description,
            features: prop.features || prop.FEATURES || [],
            agent: prop.agent || {
                name: prop.AGENT_NAME || prop.agent_name,
                phone: prop.AGENT_PHONE || prop.agent_phone,
                email: prop.AGENT_EMAIL || prop.agent_email
            },
            image_url: prop.image_url || prop.IMAGE_URL || null
        }));
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        return [];
    }
}

async function getProperty(id) {
    try {
        const property = await apiCall(`/properties/${id}`);
        // Transform to camelCase
        return {
            property_id: property.PROPERTY_ID || property.property_id,
            address: property.ADDRESS || property.address,
            city: property.CITY || property.city,
            state: property.STATE || property.state,
            zip_code: property.ZIP_CODE || property.zip_code,
            property_type: property.PROPERTY_TYPE || property.property_type || property.PROPERTY_TYPE_NAME,
            bedrooms: property.BEDROOMS || property.bedrooms,
            bathrooms: property.BATHROOMS || property.bathrooms,
            square_feet: property.SQUARE_FEET || property.square_feet,
            lot_size: property.LOT_SIZE || property.lot_size,
            year_built: property.YEAR_BUILT || property.year_built,
            listing_price: property.LISTING_PRICE || property.listing_price,
            status: property.STATUS || property.status,
            listing_date: property.LISTING_DATE || property.listing_date,
            description: property.DESCRIPTION || property.description,
            features: property.features || property.FEATURES || [],
            agent: property.agent || {
                name: property.AGENT_NAME || property.agent_name,
                phone: property.AGENT_PHONE || property.agent_phone,
                email: property.AGENT_EMAIL || property.agent_email
            },
            image_url: property.image_url || property.IMAGE_URL || null
        };
    } catch (error) {
        console.error('Failed to fetch property:', error);
        return null;
    }
}

async function createProperty(propertyData, imageFile) {
    try {
        const formData = new FormData();
        
        // Add property data as JSON string
        Object.keys(propertyData).forEach(key => {
            if (key !== 'image_url') {
                formData.append(key, propertyData[key]);
            }
        });
        
        // Add image file if provided
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch(`${API_BASE_URL}/properties`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create property');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to create property:', error);
        throw error;
    }
}

// ==================== AGENT API ====================

async function getAgents() {
    try {
        const agents = await apiCall('/agents');
        return agents.map(agent => ({
            id: agent.AGENT_ID || agent.agent_id || agent.ID || agent.id,
            name: agent.NAME || agent.name,
            phone: agent.PHONE || agent.phone,
            email: agent.EMAIL || agent.email,
            license: agent.LICENSE_NUMBER || agent.license_number,
            commission: agent.COMMISSION_RATE || agent.commission_rate,
            rating: 4.5 // Default rating
        }));
    } catch (error) {
        console.error('Failed to fetch agents:', error);
        return [];
    }
}

// Export functions for use in main script
window.API = {
    getUsers,
    signUp,
    signIn,
    updateUser,
    getProperties,
    getProperty,
    createProperty,
    getAgents
};

// Check if API is available
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ API connected:', data);
        return true;
    } catch (error) {
        console.error('❌ API not available:', error.message);
        console.error('   Make sure the server is running on http://localhost:3000');
        console.error('   Run: npm start');
        return false;
    }
}

// Initialize API check on load
window.addEventListener('DOMContentLoaded', () => {
    checkAPIConnection().then(connected => {
        if (!connected) {
            console.warn('⚠️ API not available, some features may not work');
        }
    });
});

