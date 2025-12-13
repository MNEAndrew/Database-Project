// ==================== AUTHENTICATION SYSTEM ====================

// User Storage Management
function getUsers() {
    const users = localStorage.getItem('realEstateUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('realEstateUsers', JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Generate unique ID
function generateId(prefix) {
    return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Authentication Functions
function signUp(userData) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create user object
    const newUser = {
        id: userData.accountType === 'realtor' ? generateId('A') : generateId('B'),
        accountType: userData.accountType,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        ...(userData.accountType === 'realtor' ? {
            licenseNumber: userData.licenseNumber || '',
            commissionRate: parseFloat(userData.commissionRate) || 0
        } : {
            budgetMin: parseFloat(userData.budgetMin) || 0,
            budgetMax: parseFloat(userData.budgetMax) || 0,
            preferredBedrooms: parseInt(userData.preferredBedrooms) || 0,
            preferredBathrooms: parseFloat(userData.preferredBathrooms) || 0
        })
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, user: newUser };
}

function signIn(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

function signOut() {
    setCurrentUser(null);
    updateUI();
}

// Update UI based on authentication state
function updateUI() {
    const user = getCurrentUser();
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (user) {
        userMenu.style.display = 'flex';
        authButtons.style.display = 'none';
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userType').textContent = user.accountType === 'realtor' ? 'Realtor' : 'Buyer';
        
        // Update profile picture in header
        const userInfo = userMenu.querySelector('.user-info');
        if (userInfo) {
            let profilePic = userInfo.querySelector('.user-profile-pic');
            if (!profilePic) {
                profilePic = document.createElement('div');
                profilePic.className = 'user-profile-pic';
                userInfo.insertBefore(profilePic, userInfo.firstChild);
            }
            if (user.profilePicture) {
                profilePic.innerHTML = `<img src="${user.profilePicture}" alt="Profile">`;
            } else {
                profilePic.innerHTML = '<div class="profile-placeholder">👤</div>';
            }
        }
    } else {
        userMenu.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

// ==================== AGENTS DATA ====================
// Sample agents data (would come from database)
const agentsData = [
    { id: 'A001', name: 'Sarah Johnson', phone: '555-0101', email: 'sarah.j@realty.com', license: 'LIC-12345', commission: 3.00, rating: 4.8 },
    { id: 'A002', name: 'Michael Chen', phone: '555-0102', email: 'michael.c@realty.com', license: 'LIC-12346', commission: 2.75, rating: 4.6 },
    { id: 'A003', name: 'Emily Rodriguez', phone: '555-0103', email: 'emily.r@realty.com', license: 'LIC-12347', commission: 3.25, rating: 4.9 },
    { id: 'A004', name: 'David Kim', phone: '555-0104', email: 'david.k@realty.com', license: 'LIC-12348', commission: 2.50, rating: 4.5 },
    { id: 'A005', name: 'Jessica White', phone: '555-0105', email: 'jessica.w@realty.com', license: 'LIC-12349', commission: 3.00, rating: 4.7 }
];

// ==================== PROPERTY DATA ====================
// Property Data (This would normally come from an API)
// Sample data based on the database structure
const propertiesData = [
    {
        property_id: 'P001',
        address: '123 Oak Street',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        property_type: 'Single Family',
        bedrooms: 3,
        bathrooms: 2.0,
        square_feet: 1800,
        lot_size: 0.25,
        year_built: 1995,
        listing_price: 275000,
        status: 'On Market',
        listing_date: '2023-06-01',
        description: 'Beautiful single-family home with updated kitchen',
        features: ['Garage', 'Fireplace'],
        agent: { name: 'Sarah Johnson', phone: '555-0101', email: 'sarah.j@realty.com' },
        image_url: null
    },
    {
        property_id: 'P002',
        address: '456 Maple Avenue',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62702',
        property_type: 'Condo',
        bedrooms: 2,
        bathrooms: 1.5,
        square_feet: 1200,
        lot_size: 0.10,
        year_built: 2010,
        listing_price: 185000,
        status: 'On Market',
        listing_date: '2023-06-05',
        description: 'Modern condo with great amenities',
        features: ['Balcony', 'Gym Access'],
        agent: { name: 'Michael Chen', phone: '555-0102', email: 'michael.c@realty.com' },
        image_url: null
    },
    {
        property_id: 'P003',
        address: '789 Pine Road',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62703',
        property_type: 'Single Family',
        bedrooms: 4,
        bathrooms: 2.5,
        square_feet: 2200,
        lot_size: 0.35,
        year_built: 2005,
        listing_price: 325000,
        status: 'Pending',
        listing_date: '2023-05-20',
        description: 'Spacious family home with large yard',
        features: ['Garage', 'Pool', 'Fireplace'],
        agent: { name: 'Emily Rodriguez', phone: '555-0103', email: 'emily.r@realty.com' },
        image_url: null
    },
    {
        property_id: 'P005',
        address: '555 Cedar Lane',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        property_type: 'Single Family',
        bedrooms: 5,
        bathrooms: 3.0,
        square_feet: 2800,
        lot_size: 0.50,
        year_built: 2018,
        listing_price: 450000,
        status: 'On Market',
        listing_date: '2023-06-10',
        description: 'Luxury home with premium finishes',
        features: ['Garage', 'Pool', 'Fireplace', 'Home Office'],
        agent: { name: 'David Kim', phone: '555-0104', email: 'david.k@realty.com' },
        image_url: null
    },
    {
        property_id: 'P006',
        address: '667 Birch Drive',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62702',
        property_type: 'Condo',
        bedrooms: 1,
        bathrooms: 1.0,
        square_feet: 800,
        lot_size: 0.05,
        year_built: 2012,
        listing_price: 125000,
        status: 'On Market',
        listing_date: '2023-06-12',
        description: 'Cozy studio condo perfect for first-time buyer',
        features: ['Balcony'],
        agent: { name: 'Jessica White', phone: '555-0105', email: 'jessica.w@realty.com' },
        image_url: null
    },
    {
        property_id: 'P007',
        address: '778 Willow Way',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62703',
        property_type: 'Single Family',
        bedrooms: 4,
        bathrooms: 3.0,
        square_feet: 2400,
        lot_size: 0.40,
        year_built: 2016,
        listing_price: 380000,
        status: 'On Market',
        listing_date: '2023-06-08',
        description: 'Stunning home with open floor plan',
        features: ['Garage', 'Fireplace', 'Deck'],
        agent: { name: 'Christopher Brown', phone: '555-0106', email: 'chris.b@realty.com' },
        image_url: null
    },
    {
        property_id: 'P010',
        address: '111 Poplar Avenue',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62702',
        property_type: 'Luxury',
        bedrooms: 6,
        bathrooms: 4.0,
        square_feet: 3500,
        lot_size: 0.75,
        year_built: 2020,
        listing_price: 650000,
        status: 'On Market',
        listing_date: '2023-06-15',
        description: 'Luxury estate with pool and tennis court',
        features: ['Garage', 'Pool', 'Tennis Court', 'Home Office', 'Wine Cellar'],
        agent: { name: 'Olivia Martinez', phone: '555-0109', email: 'olivia.m@realty.com' },
        image_url: null
    },
    {
        property_id: 'P011',
        address: '222 Hickory Road',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62703',
        property_type: 'Single Family',
        bedrooms: 3,
        bathrooms: 2.0,
        square_feet: 1750,
        lot_size: 0.22,
        year_built: 2008,
        listing_price: 265000,
        status: 'On Market',
        listing_date: '2023-06-11',
        description: 'Well-maintained home in quiet neighborhood',
        features: ['Garage'],
        agent: { name: 'Matthew Taylor', phone: '555-0110', email: 'matthew.t@realty.com' },
        image_url: null
    },
    {
        property_id: 'P012',
        address: '333 Walnut Boulevard',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        property_type: 'Condo',
        bedrooms: 2,
        bathrooms: 2.0,
        square_feet: 1100,
        lot_size: 0.08,
        year_built: 2013,
        listing_price: 165000,
        status: 'On Market',
        listing_date: '2023-06-13',
        description: 'Updated condo with modern features',
        features: ['Balcony', 'Gym Access'],
        agent: { name: 'Sophia Anderson', phone: '555-0111', email: 'sophia.a@realty.com' },
        image_url: null
    },
    {
        property_id: 'P013',
        address: '444 Cherry Lane',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        property_type: 'Single Family',
        bedrooms: 5,
        bathrooms: 3.5,
        square_feet: 3000,
        lot_size: 0.55,
        year_built: 2019,
        listing_price: 520000,
        status: 'Pending',
        listing_date: '2023-06-06',
        description: 'New construction with smart home features',
        features: ['Garage', 'Smart Home', 'Solar Panels'],
        agent: { name: 'Andrew Thomas', phone: '555-0112', email: 'andrew.t@realty.com' },
        image_url: null
    },
    {
        property_id: 'P015',
        address: '666 Plum Way',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62703',
        property_type: 'Townhouse',
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 1700,
        lot_size: 0.18,
        year_built: 2016,
        listing_price: 255000,
        status: 'On Market',
        listing_date: '2023-06-14',
        description: 'End-unit townhouse with private patio',
        features: ['Garage', 'Patio'],
        agent: { name: 'Joseph Harris', phone: '555-0114', email: 'joseph.h@realty.com' },
        image_url: null
    },
    {
        property_id: 'P016',
        address: '777 Apple Court',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        property_type: 'Single Family',
        bedrooms: 4,
        bathrooms: 2.5,
        square_feet: 2100,
        lot_size: 0.32,
        year_built: 2012,
        listing_price: 315000,
        status: 'On Market',
        listing_date: '2023-06-09',
        description: 'Family-friendly home with finished basement',
        features: ['Garage', 'Finished Basement'],
        agent: { name: 'Mia Clark', phone: '555-0115', email: 'mia.c@realty.com' },
        image_url: null
    },
    {
        property_id: 'P017',
        address: '888 Orange Street',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        property_type: 'Condo',
        bedrooms: 1,
        bathrooms: 1.5,
        square_feet: 950,
        lot_size: 0.06,
        year_built: 2015,
        listing_price: 145000,
        status: 'On Market',
        listing_date: '2023-06-16',
        description: 'Affordable starter condo',
        features: ['Balcony'],
        agent: { name: 'William Lewis', phone: '555-0116', email: 'william.l@realty.com' },
        image_url: null
    },
    {
        property_id: 'P022',
        address: '1313 Mango Drive',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62702',
        property_type: 'Single Family',
        bedrooms: 5,
        bathrooms: 3.5,
        square_feet: 2900,
        lot_size: 0.52,
        year_built: 2020,
        listing_price: 495000,
        status: 'On Market',
        listing_date: '2023-06-19',
        description: 'Premium home with high-end finishes',
        features: ['Garage', 'Pool', 'Home Office'],
        agent: { name: 'Sarah Johnson', phone: '555-0101', email: 'sarah.j@realty.com' },
        image_url: null
    },
    {
        property_id: 'P033',
        address: '2424 Cranberry Street',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        property_type: 'Luxury',
        bedrooms: 7,
        bathrooms: 5.0,
        square_feet: 4200,
        lot_size: 1.00,
        year_built: 2021,
        listing_price: 850000,
        status: 'On Market',
        listing_date: '2023-06-26',
        description: 'Ultra-luxury estate with guest house',
        features: ['Garage', 'Guest House', 'Pool', 'Tennis Court'],
        agent: { name: 'Andrew Thomas', phone: '555-0112', email: 'andrew.t@realty.com' },
        image_url: null
    }
];

// State Management
let filteredProperties = [...propertiesData];
let currentView = 'grid';

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const priceFilter = document.getElementById('priceFilter');
const bedroomFilter = document.getElementById('bedroomFilter');
const bathroomFilter = document.getElementById('bathroomFilter');
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFilters = document.getElementById('clearFilters');
const viewButtons = document.querySelectorAll('.view-btn');
const propertyModal = document.getElementById('propertyModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format address
function formatAddress(property) {
    return `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
}

// Get status class
function getStatusClass(status) {
    const statusMap = {
        'On Market': 'on-market',
        'Pending': 'pending',
        'Sold': 'sold',
        'Off Market': 'sold',
        'Withdrawn': 'sold'
    };
    return statusMap[status] || 'sold';
}

// Create property card
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = `property-card ${currentView === 'list' ? 'list-view' : ''}`;
    card.onclick = () => showPropertyModal(property);

    const statusClass = getStatusClass(property.status);
    
    const hasImage = property.image_url;
    const imageStyle = hasImage 
        ? `background-image: url('${property.image_url}'); background-size: cover; background-position: center;`
        : '';
    
    card.innerHTML = `
        <div class="property-image ${!hasImage ? 'no-image' : ''}" style="${imageStyle}">
            ${!hasImage ? '<div class="no-image-text">No Image</div>' : ''}
            <span class="property-status ${statusClass}">${property.status}</span>
        </div>
        <div class="property-content">
            <div class="property-price">${formatCurrency(property.listing_price)}</div>
            <div class="property-address">${formatAddress(property)}</div>
            <div class="property-details">
                <div class="property-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>${property.bedrooms} bed</span>
                </div>
                <div class="property-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                    </svg>
                    <span>${property.bathrooms} bath</span>
                </div>
                <div class="property-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                    <span>${property.square_feet.toLocaleString()} sqft</span>
                </div>
            </div>
            <div class="property-type">${property.property_type}</div>
            ${property.features.length > 0 ? `
                <div class="property-features">
                    ${property.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return card;
}

// Filter properties - uses SQL queries if API available
async function filterProperties() {
    // Check if API is available
    const apiAvailable = window.API && typeof window.API.getProperties === 'function';
    
    if (apiAvailable) {
        // Use SQL-based filtering via API
        try {
            loadingState.style.display = 'block';
            emptyState.style.display = 'none';
            
            // Build filter object from form inputs
            const filters = {};
            
            // Search filter
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                filters.search = searchTerm;
            }
            
            // Price filter
            const priceValue = priceFilter.value;
            if (priceValue) {
                if (priceValue.includes('+')) {
                    filters.priceMin = parseInt(priceValue.replace('+', ''));
                } else {
                    const [min, max] = priceValue.split('-').map(Number);
                    filters.priceMin = min;
                    filters.priceMax = max;
                }
            }
            
            // Bedroom filter
            const bedroomValue = bedroomFilter.value;
            if (bedroomValue) {
                filters.bedrooms = bedroomValue;
            }
            
            // Bathroom filter
            const bathroomValue = bathroomFilter.value;
            if (bathroomValue) {
                filters.bathrooms = bathroomValue;
            }
            
            // Type filter
            const typeValue = typeFilter.value;
            if (typeValue) {
                filters.propertyType = typeValue;
            }
            
            // Status filter
            const statusValue = statusFilter.value;
            if (statusValue) {
                filters.status = statusValue;
            }
            
            // Fetch filtered properties from Oracle database
            const properties = await window.API.getProperties(filters);
            filteredProperties = properties;
            renderProperties();
        } catch (error) {
            console.error('Error fetching filtered properties:', error);
            // Fall back to local filtering
            filterPropertiesLocal();
        }
    } else {
        // Fall back to local filtering if API not available
        filterPropertiesLocal();
    }
}

// Local filtering fallback (for when API is not available)
function filterPropertiesLocal() {
    let filtered = [...propertiesData];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(property => {
            const searchableText = `${property.address} ${property.city} ${property.state} ${property.zip_code} ${property.description}`.toLowerCase();
            return searchableText.includes(searchTerm);
        });
    }

    // Price filter
    const priceValue = priceFilter.value;
    if (priceValue) {
        if (priceValue.includes('+')) {
            const minPrice = parseInt(priceValue.replace('+', ''));
            filtered = filtered.filter(p => p.listing_price >= minPrice);
        } else {
            const [min, max] = priceValue.split('-').map(Number);
            filtered = filtered.filter(p => p.listing_price >= min && p.listing_price <= max);
        }
    }

    // Bedroom filter
    const bedroomValue = bedroomFilter.value;
    if (bedroomValue) {
        filtered = filtered.filter(p => p.bedrooms >= parseInt(bedroomValue));
    }

    // Bathroom filter
    const bathroomValue = bathroomFilter.value;
    if (bathroomValue) {
        filtered = filtered.filter(p => p.bathrooms >= parseFloat(bathroomValue));
    }

    // Type filter
    const typeValue = typeFilter.value;
    if (typeValue) {
        filtered = filtered.filter(p => p.property_type === typeValue);
    }

    // Status filter
    const statusValue = statusFilter.value;
    if (statusValue) {
        filtered = filtered.filter(p => p.status === statusValue);
    }

    filteredProperties = filtered;
    renderProperties();
}

// Render properties
function renderProperties() {
    // Hide loading state
    loadingState.style.display = 'none';

    // Clear grid
    propertiesGrid.innerHTML = '';

    // Update results count
    const count = filteredProperties.length;
    resultsCount.textContent = `${count} ${count === 1 ? 'property' : 'properties'} found`;

    // Show empty state if no results
    if (count === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Render property cards
    filteredProperties.forEach(property => {
        const card = createPropertyCard(property);
        propertiesGrid.appendChild(card);
    });
}

// Show property modal
function showPropertyModal(property) {
    const statusClass = getStatusClass(property.status);
    const hasImage = property.image_url;
    const imageStyle = hasImage 
        ? `background-image: url('${property.image_url}'); background-size: cover; background-position: center;`
        : '';
    
    modalBody.innerHTML = `
        <div class="modal-image ${!hasImage ? 'no-image' : ''}" style="${imageStyle}">
            ${!hasImage ? '<div class="no-image-text">No Image</div>' : ''}
            <span class="property-status ${statusClass}" style="position: absolute; top: 16px; right: 16px;">${property.status}</span>
        </div>
        <div class="modal-header">
            <div class="modal-price">${formatCurrency(property.listing_price)}</div>
            <div class="modal-address">${formatAddress(property)}</div>
        </div>
        <div class="modal-details">
            <div class="modal-detail-item">
                <div class="modal-detail-label">Bedrooms</div>
                <div class="modal-detail-value">${property.bedrooms}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">Bathrooms</div>
                <div class="modal-detail-value">${property.bathrooms}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">Square Feet</div>
                <div class="modal-detail-value">${property.square_feet.toLocaleString()}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">Lot Size</div>
                <div class="modal-detail-value">${property.lot_size} acres</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">Year Built</div>
                <div class="modal-detail-value">${property.year_built}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-label">Type</div>
                <div class="modal-detail-value">${property.property_type}</div>
            </div>
        </div>
        <div class="modal-description">
            <h3>About this home</h3>
            <p>${property.description}</p>
        </div>
        ${property.features.length > 0 ? `
            <div class="modal-features">
                <h3>Features</h3>
                <div class="modal-features-list">
                    ${property.features.map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        ` : ''}
        <div class="modal-agent">
            <h3>Listing Agent</h3>
            <div class="modal-agent-info">
                <div class="modal-agent-details">
                    <div class="modal-agent-name">${property.agent.name}</div>
                    <div class="modal-agent-contact">${property.agent.phone} • ${property.agent.email}</div>
                </div>
            </div>
        </div>
    `;

    propertyModal.classList.add('show');
}

// Close modal
function closeModal() {
    propertyModal.classList.remove('show');
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    priceFilter.value = '';
    bedroomFilter.value = '';
    bathroomFilter.value = '';
    typeFilter.value = '';
    statusFilter.value = '';
    filterProperties().catch(err => console.error('Error filtering:', err));
}

// Change view
function changeView(view) {
    currentView = view;
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    propertiesGrid.classList.toggle('list-view', view === 'list');
    renderProperties();
}

// ==================== PAGE NAVIGATION ====================
const mainContent = document.querySelector('.main-content');
const searchSection = document.querySelector('.search-section');
const filtersSection = document.querySelector('.filters-section');
const buyPage = mainContent;
const rentPage = document.getElementById('rentPage');
const sellPage = document.getElementById('sellPage');
const settingsPage = document.getElementById('settingsPage');
const agentFinderPage = document.getElementById('agentFinderPage');
const navLinks = document.querySelectorAll('.nav-link');

function showPage(page) {
    // Hide all pages
    [buyPage, rentPage, sellPage, settingsPage, agentFinderPage].forEach(p => {
        if (p) p.style.display = 'none';
    });
    searchSection.style.display = 'none';
    filtersSection.style.display = 'none';
    
    // Show selected page
    if (page === 'buy') {
        buyPage.style.display = 'block';
        searchSection.style.display = 'block';
        filtersSection.style.display = 'block';
    } else if (page === 'rent') {
        rentPage.style.display = 'block';
    } else if (page === 'sell') {
        sellPage.style.display = 'block';
    } else if (page) {
        // Handle page element directly
        if (typeof page === 'object' && page !== null) {
            page.style.display = 'block';
        }
    }
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkText = link.textContent.trim().toLowerCase();
        if ((page === 'buy' && linkText === 'buy') ||
            (page === 'rent' && linkText === 'rent') ||
            (page === 'sell' && linkText === 'sell') ||
            (page === agentFinderPage && linkText === 'agent finder')) {
            link.classList.add('active');
        }
    });
}

// ==================== AGENT FINDER ====================
function renderAgents() {
    const agentsList = document.getElementById('agentsList');
    if (!agentsList) return;
    
    // Get all users who are realtors
    const users = getUsers();
    const realtorUsers = users.filter(u => u.accountType === 'realtor');
    
    // Combine with sample agents data
    const allAgents = [...agentsData];
    realtorUsers.forEach(user => {
        if (!allAgents.find(a => a.email === user.email)) {
            allAgents.push({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                license: user.licenseNumber || 'N/A',
                commission: user.commissionRate || 0,
                rating: 4.5,
                profilePicture: user.profilePicture || null
            });
        }
    });
    
    agentsList.innerHTML = allAgents.map(agent => `
        <div class="agent-card">
            <div class="agent-header">
                <div class="agent-profile-pic">
                    ${agent.profilePicture ? 
                        `<img src="${agent.profilePicture}" alt="${agent.name}">` :
                        `<div class="agent-placeholder">👤</div>`
                    }
                </div>
                <div class="agent-name">${agent.name}</div>
            </div>
            <div class="agent-details">
                <div class="agent-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>${agent.phone}</span>
                </div>
                <div class="agent-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>${agent.email}</span>
                </div>
                <div class="agent-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>License: ${agent.license}</span>
                </div>
            </div>
            <div class="agent-rating">
                <span class="agent-rating-value">${agent.rating}</span>
                <span>★</span>
            </div>
            <div class="agent-commission">Commission Rate: ${agent.commission}%</div>
        </div>
    `).join('');
}

// ==================== SETTINGS PAGE ====================
function renderSettingsPage() {
    const settingsFormContainer = document.getElementById('settingsFormContainer');
    const user = getCurrentUser();
    
    if (!user) {
        settingsFormContainer.innerHTML = `
            <p>Please <a href="#" id="settingsLoginLink" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">sign in</a> to access settings.</p>
        `;
        document.getElementById('settingsLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('loginModal');
        });
        return;
    }
    
    const isRealtor = user.accountType === 'realtor';
    
    settingsFormContainer.innerHTML = `
        <div class="sell-form">
            <h3>Update Your Preferences</h3>
            <form id="settingsForm" class="auth-form">
                <div class="form-group">
                    <label for="profilePictureFile">Profile Picture</label>
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                        <div id="profilePicturePreview" style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--border-color); background-color: var(--bg-light); display: flex; align-items: center; justify-content: center;">
                            ${user.profilePicture ? 
                                `<img src="${user.profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">` :
                                `<div style="color: var(--text-light); font-size: 24px;">👤</div>`
                            }
                        </div>
                        <div style="flex: 1;">
                            <input type="file" id="profilePictureFile" class="form-input" accept="image/*" style="padding: 8px;">
                            <small style="color: var(--text-secondary); font-size: 12px; display: block; margin-top: 4px;">
                                Upload a profile picture
                            </small>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="settingsName">Full Name</label>
                    <input type="text" id="settingsName" class="form-input" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="settingsEmail">Email</label>
                    <input type="email" id="settingsEmail" class="form-input" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="settingsPhone">Phone</label>
                    <input type="tel" id="settingsPhone" class="form-input" value="${user.phone || ''}" required>
                </div>
                ${isRealtor ? `
                    <div class="form-group">
                        <label for="settingsLicense">License Number</label>
                        <input type="text" id="settingsLicense" class="form-input" value="${user.licenseNumber || ''}">
                    </div>
                    <div class="form-group">
                        <label for="settingsCommission">Commission Rate (%)</label>
                        <input type="number" id="settingsCommission" class="form-input" value="${user.commissionRate || 0}" min="0" max="100" step="0.01">
                    </div>
                ` : `
                    <div class="form-group">
                        <label for="settingsBudgetMin">Budget Min ($)</label>
                        <input type="number" id="settingsBudgetMin" class="form-input" value="${user.budgetMin || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label for="settingsBudgetMax">Budget Max ($)</label>
                        <input type="number" id="settingsBudgetMax" class="form-input" value="${user.budgetMax || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label for="settingsBedrooms">Preferred Bedrooms</label>
                        <input type="number" id="settingsBedrooms" class="form-input" value="${user.preferredBedrooms || 0}" min="0">
                    </div>
                    <div class="form-group">
                        <label for="settingsBathrooms">Preferred Bathrooms</label>
                        <input type="number" id="settingsBathrooms" class="form-input" value="${user.preferredBathrooms || 0}" min="0" step="0.5">
                    </div>
                `}
                <div class="form-group">
                    <label for="settingsPassword">New Password (leave blank to keep current)</label>
                    <input type="password" id="settingsPassword" class="form-input" minlength="6">
                </div>
                <div class="form-group">
                    <label for="settingsConfirmPassword">Confirm New Password</label>
                    <input type="password" id="settingsConfirmPassword" class="form-input" minlength="6">
                </div>
                <button type="submit" class="btn-primary btn-full">Save Changes</button>
            </form>
            <div id="settingsError" class="error-message"></div>
            <div id="settingsSuccess" class="success-message"></div>
        </div>
    `;
    
    // Profile picture preview handler
    const profilePictureFile = document.getElementById('profilePictureFile');
    const profilePicturePreview = document.getElementById('profilePicturePreview');
    
    profilePictureFile?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePicturePreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('settingsError');
        const successDiv = document.getElementById('settingsSuccess');
        
        const newPassword = document.getElementById('settingsPassword').value;
        const confirmPassword = document.getElementById('settingsConfirmPassword').value;
        
        if (newPassword && newPassword !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.classList.add('show');
            successDiv.classList.remove('show');
            return;
        }
        
        if (newPassword && newPassword.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            errorDiv.classList.add('show');
            successDiv.classList.remove('show');
            return;
        }
        
        // Handle profile picture upload
        let profilePictureData = user.profilePicture || null;
        const profilePictureFileInput = document.getElementById('profilePictureFile');
        if (profilePictureFileInput?.files[0]) {
            profilePictureData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.readAsDataURL(profilePictureFileInput.files[0]);
            });
        }
        
        // Update user data
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) {
            errorDiv.textContent = 'User not found';
            errorDiv.classList.add('show');
            return;
        }
        
        // Update user information
        users[userIndex].name = document.getElementById('settingsName').value;
        users[userIndex].email = document.getElementById('settingsEmail').value;
        users[userIndex].phone = document.getElementById('settingsPhone').value;
        users[userIndex].profilePicture = profilePictureData;
        
        if (newPassword) {
            users[userIndex].password = newPassword;
        }
        
        if (isRealtor) {
            users[userIndex].licenseNumber = document.getElementById('settingsLicense').value;
            users[userIndex].commissionRate = parseFloat(document.getElementById('settingsCommission').value) || 0;
        } else {
            users[userIndex].budgetMin = parseFloat(document.getElementById('settingsBudgetMin').value) || 0;
            users[userIndex].budgetMax = parseFloat(document.getElementById('settingsBudgetMax').value) || 0;
            users[userIndex].preferredBedrooms = parseInt(document.getElementById('settingsBedrooms').value) || 0;
            users[userIndex].preferredBathrooms = parseFloat(document.getElementById('settingsBathrooms').value) || 0;
        }
        
        saveUsers(users);
        
        // Update current user
        const { password: _, ...updatedUser } = users[userIndex];
        setCurrentUser(updatedUser);
        updateUI();
        
        // Update profile picture preview if still on settings page
        if (profilePictureData) {
            profilePicturePreview.innerHTML = `<img src="${profilePictureData}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        
        successDiv.textContent = 'Settings updated successfully!';
        successDiv.classList.add('show');
        errorDiv.classList.remove('show');
        
        // Clear password fields
        document.getElementById('settingsPassword').value = '';
        document.getElementById('settingsConfirmPassword').value = '';
    });
}

// ==================== RENT PAGE ====================
async function renderRentPage() {
    const rentPageContent = document.getElementById('rentPage');
    if (!rentPageContent) return;
    
    const rentContainer = rentPageContent.querySelector('.content-container');
    if (!rentContainer) return;
    
    // Always update the content
    rentContainer.innerHTML = `
        <h2>Rental Properties</h2>
        <div class="rent-content">
            <p style="margin-bottom: 24px; color: var(--text-secondary);">
                Browse available rental properties in your area.
            </p>
            <div id="rentPropertiesGrid" class="properties-grid">
                <!-- Rental properties will be shown here -->
            </div>
            <div id="rentEmptyState" class="empty-state" style="display: none;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h3>No rental properties available</h3>
                <p>Check back soon for rental listings</p>
            </div>
        </div>
    `;
    
    const rentGrid = document.getElementById('rentPropertiesGrid');
    const rentEmpty = document.getElementById('rentEmptyState');
    
    if (!rentGrid || !rentEmpty) return;
    
    rentGrid.innerHTML = '';
    loadingState.style.display = 'block';
    
    // Check if API is available
    const apiAvailable = window.API && typeof window.API.getProperties === 'function';
    
    if (apiAvailable) {
        try {
            // Use SQL query to get rental properties (under $200k, On Market)
            const rentalProperties = await window.API.getProperties({
                priceMax: 200000,
                status: 'On Market'
            });
            
            loadingState.style.display = 'none';
            
            if (rentalProperties.length > 0) {
                rentEmpty.style.display = 'none';
                rentGrid.style.display = 'grid';
                rentalProperties.forEach(property => {
                    const card = createPropertyCard(property);
                    rentGrid.appendChild(card);
                });
            } else {
                rentGrid.style.display = 'none';
                rentEmpty.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching rental properties:', error);
            loadingState.style.display = 'none';
            // Fall back to local filtering
            const rentalProperties = propertiesData.filter(p => p.listing_price < 200000 && p.status === 'On Market');
            if (rentalProperties.length > 0) {
                rentEmpty.style.display = 'none';
                rentGrid.style.display = 'grid';
                rentalProperties.forEach(property => {
                    const card = createPropertyCard(property);
                    rentGrid.appendChild(card);
                });
            } else {
                rentGrid.style.display = 'none';
                rentEmpty.style.display = 'block';
            }
        }
    } else {
        // Fall back to local filtering
        loadingState.style.display = 'none';
        const rentalProperties = propertiesData.filter(p => p.listing_price < 200000 && p.status === 'On Market');
        if (rentalProperties.length > 0) {
            rentEmpty.style.display = 'none';
            rentGrid.style.display = 'grid';
            rentalProperties.forEach(property => {
                const card = createPropertyCard(property);
                rentGrid.appendChild(card);
            });
        } else {
            rentGrid.style.display = 'none';
            rentEmpty.style.display = 'block';
        }
    }
}

// ==================== SELL PAGE ====================
function renderSellPage() {
    const sellPage = document.getElementById('sellPage');
    if (!sellPage) return;
    
    const sellFormContainer = document.getElementById('sellFormContainer');
    if (!sellFormContainer) return;
    
    const user = getCurrentUser();
    
    if (!user) {
        sellFormContainer.innerHTML = `
            <div style="text-align: center; padding: 48px 24px;">
                <h3 style="margin-bottom: 16px; color: var(--text-primary);">Sign In Required</h3>
                <p style="margin-bottom: 24px; color: var(--text-secondary);">
                    Please sign in to list your property for sale.
                </p>
                <a href="#" id="sellLoginLink" class="btn-primary" style="text-decoration: none; display: inline-block;">Sign In</a>
            </div>
        `;
        document.getElementById('sellLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('loginModal');
        });
        return;
    }
    
    if (user.accountType !== 'realtor' && user.accountType !== 'buyer') {
        sellFormContainer.innerHTML = `
            <p>You need to be a registered user to list properties. Please contact support.</p>
        `;
        return;
    }
    
    sellFormContainer.innerHTML = `
        <div class="sell-form">
            <h3>List Your Property</h3>
            <form id="listPropertyForm" class="auth-form">
                <div class="form-group">
                    <label for="propertyAddress">Address</label>
                    <input type="text" id="propertyAddress" class="form-input" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="propertyCity">City</label>
                        <input type="text" id="propertyCity" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="propertyState">State</label>
                        <input type="text" id="propertyState" class="form-input" maxlength="2" required>
                    </div>
                    <div class="form-group">
                        <label for="propertyZip">ZIP Code</label>
                        <input type="text" id="propertyZip" class="form-input" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="propertyType">Property Type</label>
                        <select id="propertyType" class="form-input" required>
                            <option value="">Select type</option>
                            <option value="Single Family">Single Family</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Multi-Family">Multi-Family</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Ranch">Ranch</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="propertyPrice">Listing Price ($)</label>
                        <input type="number" id="propertyPrice" class="form-input" min="0" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="propertyBedrooms">Bedrooms</label>
                        <input type="number" id="propertyBedrooms" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="propertyBathrooms">Bathrooms</label>
                        <input type="number" id="propertyBathrooms" class="form-input" min="0" step="0.5" required>
                    </div>
                    <div class="form-group">
                        <label for="propertySqft">Square Feet</label>
                        <input type="number" id="propertySqft" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="propertyLotSize">Lot Size (Acres)</label>
                        <input type="number" id="propertyLotSize" class="form-input" min="0" step="0.01" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="propertyDescription">Description</label>
                    <textarea id="propertyDescription" class="form-input" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label>Property Features/Tags</label>
                    <div id="featuresContainer" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        <!-- Features will be added here -->
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="newFeatureInput" class="form-input" placeholder="Add feature (e.g., Garage, Pool)" style="flex: 1;">
                        <button type="button" id="addFeatureBtn" class="btn-secondary" style="white-space: nowrap;">Add Feature</button>
                    </div>
                    <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">
                        Common features: Garage, Pool, Fireplace, Balcony, Gym Access, Home Office, etc.
                    </small>
                </div>
                <div class="form-group">
                    <label for="propertyImageFile">Property Image</label>
                    <input type="file" id="propertyImageFile" class="form-input" accept="image/*">
                    <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">
                        Upload an image of the property (optional)
                    </small>
                    <div id="propertyImagePreview" style="margin-top: 12px; display: none;">
                        <img id="propertyImagePreviewImg" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid var(--border-color);">
                    </div>
                </div>
                <button type="submit" class="btn-primary btn-full">List Property</button>
            </form>
            <div id="listPropertyError" class="error-message"></div>
            <div id="listPropertySuccess" class="success-message"></div>
        </div>
    `;
    
    // Features/Tags management
    let selectedFeatures = [];
    const featuresContainer = document.getElementById('featuresContainer');
    const newFeatureInput = document.getElementById('newFeatureInput');
    const addFeatureBtn = document.getElementById('addFeatureBtn');
    
    function renderFeatures() {
        if (!featuresContainer) return;
        featuresContainer.innerHTML = selectedFeatures.map((feature, index) => `
            <span class="feature-tag" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background-color: var(--primary-color); color: white; border-radius: 20px; font-size: 14px;">
                ${feature}
                <button type="button" onclick="removeFeature(${index})" style="background: none; border: none; color: white; cursor: pointer; padding: 0; margin-left: 4px; font-size: 16px; line-height: 1;">&times;</button>
            </span>
        `).join('');
    }
    
    window.removeFeature = function(index) {
        selectedFeatures.splice(index, 1);
        renderFeatures();
    };
    
    addFeatureBtn?.addEventListener('click', () => {
        const feature = newFeatureInput.value.trim();
        if (feature && !selectedFeatures.includes(feature)) {
            selectedFeatures.push(feature);
            renderFeatures();
            newFeatureInput.value = '';
        }
    });
    
    newFeatureInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeatureBtn.click();
        }
    });
    
    // Image preview handler
    const propertyImageFile = document.getElementById('propertyImageFile');
    const propertyImagePreview = document.getElementById('propertyImagePreview');
    const propertyImagePreviewImg = document.getElementById('propertyImagePreviewImg');
    
    propertyImageFile?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                propertyImagePreviewImg.src = event.target.result;
                propertyImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            propertyImagePreview.style.display = 'none';
        }
    });
    
    document.getElementById('listPropertyForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Handle image upload
        let imageData = null;
        const imageFile = document.getElementById('propertyImageFile').files[0];
        if (imageFile) {
            imageData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.readAsDataURL(imageFile);
            });
        }
        
        const newProperty = {
            property_id: generateId('P'),
            address: document.getElementById('propertyAddress').value,
            city: document.getElementById('propertyCity').value,
            state: document.getElementById('propertyState').value,
            zip_code: document.getElementById('propertyZip').value,
            property_type: document.getElementById('propertyType').value,
            bedrooms: parseInt(document.getElementById('propertyBedrooms').value),
            bathrooms: parseFloat(document.getElementById('propertyBathrooms').value),
            square_feet: parseInt(document.getElementById('propertySqft').value),
            lot_size: parseFloat(document.getElementById('propertyLotSize').value) || 0.25,
            year_built: new Date().getFullYear(),
            listing_price: parseFloat(document.getElementById('propertyPrice').value),
            status: 'On Market',
            listing_date: new Date().toISOString().split('T')[0],
            description: document.getElementById('propertyDescription').value,
            features: selectedFeatures,
            agent: { name: user.name, phone: user.phone, email: user.email },
            image_url: imageData || null
        };
        
        // Reset features for next listing
        selectedFeatures = [];
        renderFeatures();
        
        // Add to properties (in real app, this would go to database)
        propertiesData.push(newProperty);
        filterProperties().catch(err => console.error('Error filtering:', err));
        
        document.getElementById('listPropertySuccess').textContent = 'Property listed successfully!';
        document.getElementById('listPropertySuccess').classList.add('show');
        document.getElementById('listPropertyForm').reset();
        propertyImagePreview.style.display = 'none';
        
        setTimeout(() => {
            showPage('buy');
        }, 2000);
    });
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== EVENT LISTENERS ====================
// Wrap async filterProperties in arrow functions for event listeners
searchInput.addEventListener('input', () => filterProperties());
priceFilter.addEventListener('change', () => filterProperties());
bedroomFilter.addEventListener('change', () => filterProperties());
bathroomFilter.addEventListener('change', () => filterProperties());
typeFilter.addEventListener('change', () => filterProperties());
statusFilter.addEventListener('change', () => filterProperties());
clearFilters.addEventListener('click', clearAllFilters);

viewButtons.forEach(btn => {
    btn.addEventListener('click', () => changeView(btn.dataset.view));
});

// Property modal
modalClose.addEventListener('click', () => closeModal('propertyModal'));
propertyModal.addEventListener('click', (e) => {
    if (e.target === propertyModal) {
        closeModal('propertyModal');
    }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Close modals on close button click
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = btn.dataset.modal || 'propertyModal';
        closeModal(modalId);
    });
});

// Navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.textContent.trim().toLowerCase();
        
        if (page === 'buy') {
            showPage('buy');
        } else if (page === 'rent') {
            showPage('rent');
            renderRentPage().catch(err => console.error('Error rendering rent page:', err));
        } else if (page === 'sell') {
            showPage('sell');
            renderSellPage();
        } else if (page === 'agent finder') {
            showPage(agentFinderPage);
            renderAgents();
        }
    });
});

// Authentication buttons
document.getElementById('signInBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('loginModal');
});

document.getElementById('joinBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('signupModal');
});

document.getElementById('settingsBtn')?.addEventListener('click', () => {
    renderSettingsPage();
    showPage(settingsPage);
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    signOut();
    showPage('buy');
});

// Switch between login and signup
document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('loginModal');
    setTimeout(() => openModal('signupModal'), 200);
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signupModal');
    setTimeout(() => openModal('loginModal'), 200);
});

// Account type change handler
document.getElementById('accountType')?.addEventListener('change', (e) => {
    const accountType = e.target.value;
    const realtorFields = document.getElementById('realtorFields');
    const buyerFields = document.getElementById('buyerFields');
    
    if (accountType === 'realtor') {
        realtorFields.style.display = 'block';
        buyerFields.style.display = 'none';
    } else if (accountType === 'buyer') {
        realtorFields.style.display = 'none';
        buyerFields.style.display = 'block';
    } else {
        realtorFields.style.display = 'none';
        buyerFields.style.display = 'none';
    }
});

// Login form
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    const result = signIn(email, password);
    
    if (result.success) {
        errorDiv.classList.remove('show');
        closeModal('loginModal');
        updateUI();
        document.getElementById('loginForm').reset();
        showPage('buy');
    } else {
        errorDiv.textContent = result.message;
        errorDiv.classList.add('show');
    }
});

// Signup form
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('signupError');
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.classList.add('show');
        return;
    }
    
    const userData = {
        accountType: document.getElementById('accountType').value,
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: password,
        licenseNumber: document.getElementById('licenseNumber')?.value || '',
        commissionRate: document.getElementById('commissionRate')?.value || '',
        budgetMin: document.getElementById('budgetMin')?.value || '',
        budgetMax: document.getElementById('budgetMax')?.value || '',
        preferredBedrooms: document.getElementById('preferredBedrooms')?.value || '',
        preferredBathrooms: document.getElementById('preferredBathrooms')?.value || ''
    };
    
    const result = signUp(userData);
    
    if (result.success) {
        errorDiv.classList.remove('show');
        closeModal('signupModal');
        updateUI();
        document.getElementById('signupForm').reset();
        document.getElementById('realtorFields').style.display = 'none';
        document.getElementById('buyerFields').style.display = 'none';
        showPage('buy');
        
        // Show success message
        alert('Account created successfully! You are now signed in.');
    } else {
        errorDiv.textContent = result.message;
        errorDiv.classList.add('show');
    }
});

// Initialize
async function init() {
    updateUI();
    
    // Check if API is available and load properties from database
    const apiAvailable = window.API && typeof window.API.getProperties === 'function';
    
    if (apiAvailable) {
        try {
            loadingState.style.display = 'block';
            // Load all properties from Oracle database
            const properties = await window.API.getProperties();
            propertiesData.length = 0; // Clear local data
            propertiesData.push(...properties); // Add database properties
            filteredProperties = [...properties];
            renderProperties();
        } catch (error) {
            console.error('Failed to load properties from database:', error);
            // Fall back to local data
            setTimeout(() => {
                renderProperties();
            }, 500);
        }
    } else {
        // Use local data if API not available
        setTimeout(() => {
            renderProperties();
        }, 500);
    }
}

// Start the app
init();

