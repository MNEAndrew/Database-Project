# Real Estate Database Project

CSE 4701 Database Project - Option 5: Real Estate Database (similar to Zillow/Redfin)

## Project Overview

This project implements a comprehensive real estate management system with both a **database backend** and a **modern web application frontend**. The system tracks agents, buyers, sellers, properties, viewings, offers, and sales. The database is designed to handle concurrent transactions where multiple customers can be interested in the same properties simultaneously.

## 🎯 Features

### Database Features
- **Property Listings**: Track properties with various statuses (On Market, Pending, Sold, etc.)
- **Buyer-Seller Matching**: Match buyers with properties within their budget
- **Concurrent Transactions**: Handle multiple buyers viewing/making offers on the same property
- **Agent Management**: Track agent performance, sales, and commissions
- **Sales Tracking**: Record completed sales with prices, dates, and commissions
- **Viewing History**: Track buyer property viewings and interests
- **Offer Management**: Track purchase offers with status (Pending, Accepted, Rejected, etc.)

### Web Application Features
- **Zillow-like Interface**: Modern, responsive design inspired by Zillow
- **User Authentication**: Sign up and sign in as Realtor or Buyer
- **Property Listings**: Browse properties with images, filters, and search
- **Property Management**: List properties with images, features, and details
- **Profile Management**: Upload profile pictures and manage account settings
- **Agent Finder**: Browse and find real estate agents
- **Image Uploads**: Upload property images and profile pictures
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

### Database Files
- **`ddl.sql`** - Complete database schema with all table definitions
- **`dropddl.sql`** - Drop statements and schema recreation
- **`smallInsert.sql`** - Small sample dataset (4 agents, 4 buyers, 4 sellers, 5 properties)
- **`largeInsert.sql`** - Large sample dataset (20 agents, 40 buyers, 30 sellers, 50 properties, 100 viewings, 30 offers, 15 sales)
- **`demo_queries.sql`** - Comprehensive demo queries (17 queries)
- **`quick_demo.sql`** - Quick demo queries (10 essential queries)
- **`DEMO_GUIDE.md`** - Detailed demo guide and documentation

### Web Application Files
- **`index.html`** - Main HTML structure
- **`styles.css`** - Complete styling and responsive design
- **`script.js`** - All functionality (authentication, property management, image uploads)
- **`.gitignore`** - Git ignore file

## 🚀 Quick Start

### Database Setup

#### 1. Create the Database Schema
```sql
-- Execute dropddl.sql to create all tables
\i dropddl.sql
```

#### 2. Populate with Sample Data
```sql
-- Option A: Small dataset (quick testing)
\i smallInsert.sql

-- Option B: Large dataset (comprehensive demo)
\i largeInsert.sql
```

#### 3. Run Demo Queries
```sql
-- Quick demo
\i quick_demo.sql

-- Or comprehensive demo
\i demo_queries.sql
```

### Web Application Setup

#### 1. Open the Application
Simply open `index.html` in a web browser, or use a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

#### 2. Create an Account
- Click "Join" in the header
- Choose account type: **Realtor** or **Buyer**
- Fill in your information:
  - **Realtors**: Name, Email, Phone, License Number, Commission Rate
  - **Buyers**: Name, Email, Phone, Budget Range, Preferred Bedrooms/Bathrooms
- Upload a profile picture (optional)
- Create your account

#### 3. Start Using the Application
- **Buy**: Browse available properties with filters and search
- **Rent**: View rental properties
- **Sell**: List your property for sale (requires login)
- **Agent Finder**: Browse available real estate agents

## 💻 Web Application Guide

### Navigation

#### Buy Tab
- Browse all available properties
- Use search bar to find properties by address, city, or ZIP code
- Filter by:
  - Price range
  - Number of bedrooms
  - Number of bathrooms
  - Property type (Single Family, Condo, Townhouse, etc.)
  - Status (On Market, Pending, Sold)
- Toggle between grid and list view
- Click any property card to view full details

#### Rent Tab
- View rental properties (properties under $200,000)
- Same filtering and search capabilities as Buy tab

#### Sell Tab
- **Not Logged In**: Sign in prompt
- **Logged In**: Property listing form with:
  - Basic Information: Address, City, State, ZIP Code
  - Property Details: Type, Price, Bedrooms, Bathrooms, Square Feet, **Lot Size (Acres)**
  - Description: Detailed property description
  - **Features/Tags**: Add multiple features (Garage, Pool, Fireplace, etc.)
  - **Image Upload**: Upload property image from your computer
  - Submit to list your property

#### Agent Finder Tab
- Browse all available real estate agents
- View agent profiles with:
  - Profile picture
  - Name and contact information
  - License number
  - Commission rate
  - Rating

### Account Features

#### Settings Page
- Update your profile information
- Upload/change profile picture
- Update preferences:
  - **Realtors**: License number, commission rate
  - **Buyers**: Budget range, preferred bedrooms/bathrooms
- Change password

#### Profile Pictures
- Upload profile pictures in Settings
- Profile pictures appear in:
  - Header (next to your name)
  - Agent Finder (for realtors)

### Property Features

#### Property Cards
- Display property image or "No Image" placeholder
- Show price, address, bedrooms, bathrooms, square feet
- Display property type and status badge
- Show up to 3 feature tags
- Click to view full details

#### Property Details Modal
- Large property image or "No Image" placeholder
- Complete property information
- All features/tags listed
- Listing agent contact information

### Image Management

#### Property Images
- Upload images when listing a property
- Images stored locally in browser
- Properties without images show "No Image" placeholder
- Images display on property cards and detail modals

#### Profile Pictures
- Upload in Settings page
- Circular profile picture
- Default placeholder if no picture uploaded

## 📊 Database Schema

The database includes the following entities:

- **Agents**: Real estate professionals with license numbers and commission rates
- **Buyers**: People looking to purchase properties (with budget ranges and preferences)
- **Sellers**: People selling properties
- **Properties**: Real estate listings with detailed information
- **Property Types**: Categories (Single Family, Condo, Townhouse, etc.)
- **Property Features**: Additional amenities (garage, pool, fireplace, etc.)
- **Viewings**: Records of buyers viewing properties
- **Offers**: Purchase offers with status tracking
- **Sales**: Completed property transactions

## 📈 Sample Data Statistics (Large Dataset)

- **20 Agents**: Real estate professionals
- **40 Buyers**: People looking to purchase
- **30 Sellers**: People selling properties
- **50 Properties**: Various property types and statuses
- **100 Viewings**: Buyer property viewings
- **30 Offers**: Purchase offers in various states
- **15 Sales**: Completed transactions

## 🔍 Example Database Queries

### View Properties on the Market
```sql
SELECT p.address, p.listing_price, p.status, a.name AS agent
FROM property p
LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
WHERE p.status = 'On Market';
```

### Show Concurrent Transactions
```sql
SELECT p.address, COUNT(DISTINCT v.buyer_id) AS concurrent_viewers
FROM property p
JOIN viewing v ON p.property_id = v.property_id
GROUP BY p.property_id, p.address
HAVING COUNT(DISTINCT v.buyer_id) > 1;
```

### Agent Performance
```sql
SELECT a.name, COUNT(s.sale_id) AS sales, SUM(s.commission_amount) AS commissions
FROM agent a
LEFT JOIN sale s ON a.agent_id = s.listing_agent_id
GROUP BY a.agent_id, a.name;
```

## 🛠️ Technical Details

### Web Application Technology
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for user data and properties
- **Design**: Responsive, mobile-first design
- **Fonts**: Inter (Google Fonts)
- **Icons**: SVG icons

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari

### Data Persistence
- All user accounts stored in browser LocalStorage
- Property listings stored in browser LocalStorage
- Images stored as base64 encoded strings
- Data persists across browser sessions

## 📝 Property Listing Form Fields

When listing a property, you can specify:

- **Address**: Street address
- **Location**: City, State, ZIP Code
- **Property Type**: Single Family, Condo, Townhouse, Multi-Family, Luxury, Ranch
- **Price**: Listing price in USD
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms (supports half baths)
- **Square Feet**: Total square footage
- **Lot Size**: Lot size in acres (supports decimals)
- **Description**: Detailed property description
- **Features/Tags**: Multiple features (Garage, Pool, Fireplace, Balcony, Gym Access, Home Office, etc.)
- **Image**: Upload property image from computer

## 🎨 Design Features

- **Zillow-inspired Design**: Clean, modern interface
- **Color Scheme**: Blue primary color (#006AFF)
- **Responsive Layout**: Adapts to all screen sizes
- **Smooth Animations**: Transitions and hover effects
- **Status Badges**: Visual indicators for property status
- **Image Placeholders**: "No Image" placeholders for properties without images

## 📚 Documentation

- **`DEMO_GUIDE.md`** - Detailed database demo guide and scenarios
- **This README** - Complete project documentation

## 🗄️ Database Compatibility

The schema uses standard SQL and should work with:
- PostgreSQL
- MySQL
- SQL Server
- Oracle

Note: Some aggregate functions (like `STRING_AGG`) may need adjustment based on your database system.

## ✅ Project Requirements

This project fulfills the requirements for CSE 4701 Database Systems course, specifically:
- Option 5: Real Estate Database (e.g., Zillow, Redfin)
- Tracks agents, buyers, sellers, properties on the market, and recently sold properties
- Handles concurrent transactions (multiple customers buying goods at the same time)
- Includes a functional web application interface

## 🔐 User Account Types

### Realtor Accounts
- Can list properties for sale
- Profile appears in Agent Finder
- Can set commission rate
- Requires license number

### Buyer Accounts
- Can browse and search properties
- Can set budget preferences
- Can specify preferred bedrooms/bathrooms
- Can list properties (if they become sellers)

## 📱 Features by Page

### Buy Page
- Property search and filtering
- Grid/List view toggle
- Property cards with images
- Detailed property modals

### Rent Page
- Rental property listings
- Same search/filter capabilities
- Property cards

### Sell Page
- Property listing form
- Image upload
- Feature/tag management
- Lot size in acres
- Form validation

### Agent Finder Page
- Agent profiles with pictures
- Contact information
- License details
- Commission rates

### Settings Page
- Profile management
- Picture upload
- Preference updates
- Password change

## 🚀 Getting Started with Web App

1. **Open the Application**
   - Open `index.html` in a web browser
   - Or use a local web server

2. **Create an Account**
   - Click "Join"
   - Choose Realtor or Buyer
   - Fill in your information
   - Upload profile picture (optional)

3. **Browse Properties**
   - Use the Buy tab to see all properties
   - Use filters to narrow down results
   - Click properties to see details

4. **List a Property**
   - Sign in
   - Go to Sell tab
   - Fill out the form
   - Add features/tags
   - Upload an image
   - Submit

5. **Find an Agent**
   - Go to Agent Finder tab
   - Browse available agents
   - View their profiles and contact info

## 📄 License

This project is for educational purposes.

## 👤 Author

Database Project - CSE 4701

---

**Note**: This is a frontend-only application using LocalStorage. For production use, you would need to connect it to a backend API that interfaces with the database.
