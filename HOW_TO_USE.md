# How to Use the Real Estate Website with Oracle Database

## Quick Start Guide

### Step 1: Start the Server

1. Open terminal/command prompt in the project folder
2. Start the server:
   ```bash
   npm start
   ```
3. You should see:
   ```
   Server running on http://localhost:3000
   Oracle database connection pool initialized
   ```

### Step 2: Open the Website

1. Open your browser
2. Go to: `http://localhost:3000`
3. The website will automatically connect to your Oracle database

### Step 3: Using SQL Developer (As Shown in Your Image)

You have SQL Developer connected to "Database Zillow Pr...". Here's how to use it:

#### View Your Data

1. **Expand your connection** (click the arrow next to "Database Zillow Pr...")
2. Navigate to: **Tables** → Select a table (e.g., `PROPERTY`, `AGENT`, `BUYER`)
3. Right-click the table → **Open** to see all data
4. Or write SQL queries in a new worksheet

#### Run SQL Queries

1. Click the **document icon with plus** (next to your connection) to open a new SQL worksheet
2. Type your query:
   ```sql
   -- View all properties
   SELECT * FROM property;
   
   -- View all agents
   SELECT * FROM agent;
   
   -- View rental properties
   SELECT * FROM property WHERE listing_type = 'Rent';
   
   -- View properties for sale
   SELECT * FROM property WHERE listing_type = 'Sale';
   ```
3. Press **F5** or click the green play button to execute

#### Insert Sample Data

If your database is empty, you can insert sample data:

```sql
-- Insert property types
INSERT INTO property_type (type_id, type_name) VALUES (1, 'Single Family');
INSERT INTO property_type (type_id, type_name) VALUES (2, 'Condo');
INSERT INTO property_type (type_id, type_name) VALUES (3, 'Townhouse');
INSERT INTO property_type (type_id, type_name) VALUES (4, 'Luxury');
COMMIT;

-- Insert a sample agent
INSERT INTO agent (agent_id, name, phone, email, license_number, commission_rate, hire_date)
VALUES ('A001', 'Sarah Johnson', '555-0101', 'sarah.j@realty.com', 'LIC-12345', 3.00, SYSDATE);
COMMIT;

-- Insert a sample property
INSERT INTO property (property_id, address, city, state, zip_code, property_type_id,
                      bedrooms, bathrooms, square_feet, lot_size, year_built, listing_price,
                      listing_type, status, listing_date, description, listing_agent_id)
VALUES ('P001', '123 Oak Street', 'Springfield', 'IL', '62701', 1,
        3, 2.0, 1800, 0.25, 1995, 275000,
        'Sale', 'On Market', SYSDATE, 'Beautiful single-family home', 'A001');
COMMIT;
```

## Using the Website Features

### 1. Create an Account

1. Click **"Join"** button (top right)
2. Choose account type:
   - **Realtor**: For listing properties
   - **Buyer**: For searching properties
3. Fill in the form and submit
4. **Data is saved to Oracle database** (check SQL Developer to see it)

### 2. Sign In

1. Click **"Sign In"** button
2. Enter your email and password
3. **Authentication checks Oracle database**

### 3. Browse Properties (Buy Tab)

- **All properties load from Oracle database**
- Use filters (price, bedrooms, etc.) - **each filter runs a SQL query**
- Click on a property card to see details

### 4. View Rental Properties (Rent Tab)

- Shows only properties with `listing_type = 'Rent'`
- **Uses SQL query**: `SELECT * FROM property WHERE listing_type = 'Rent'`

### 5. List a Property (Sell Tab)

1. Sign in as a Realtor
2. Click **"Sell"** tab
3. Fill in property details:
   - Select **"For Sale"** or **"For Rent"**
   - Add address, price, bedrooms, etc.
   - Upload property image
   - Add features/tags
4. Submit - **Property is saved to Oracle database**

### 6. Find Agents (Agent Finder Tab)

- **Loads agents from Oracle database**
- Shows agent contact information

### 7. Update Settings (Account Settings)

1. Click your name (top right) → **"Account Settings"**
2. Update your information
3. **Changes are saved to Oracle database**

## Monitor Database Activity

### In SQL Developer

1. **Watch queries in real-time:**
   - Open a SQL worksheet
   - Run: `SELECT * FROM property ORDER BY listing_date DESC;`
   - Refresh after adding properties on the website

2. **Check user accounts:**
   ```sql
   -- View all agents
   SELECT * FROM agent;
   
   -- View all buyers
   SELECT * FROM buyer;
   ```

3. **View property features:**
   ```sql
   SELECT p.address, pf.feature_name
   FROM property p
   JOIN property_feature pf ON p.property_id = pf.property_id;
   ```

### In Server Console

When you run `npm start`, the server console shows all SQL queries:

```
Executing SQL: SELECT p.*, pt.type_name as property_type, ...
With binds: { listingType: 'Rent', status: 'On Market' }
Found 6 properties
```

## Common Tasks

### Add More Sample Data

```sql
-- Add more properties
INSERT INTO property (property_id, address, city, state, zip_code, property_type_id,
                      bedrooms, bathrooms, square_feet, lot_size, year_built, listing_price,
                      listing_type, status, listing_date, description, listing_agent_id)
VALUES 
('P002', '456 Maple Ave', 'Springfield', 'IL', '62702', 2, 2, 1.5, 1200, 0.10, 2010, 1500, 'Rent', 'On Market', SYSDATE, 'Modern condo', 'A001'),
('P003', '789 Pine Rd', 'Springfield', 'IL', '62703', 1, 4, 2.5, 2200, 0.35, 2005, 325000, 'Sale', 'On Market', SYSDATE, 'Spacious home', 'A001');
COMMIT;
```

### Update Property Status

```sql
-- Mark property as sold
UPDATE property SET status = 'Sold' WHERE property_id = 'P001';
COMMIT;
```

### Delete Test Data

```sql
-- Delete a property
DELETE FROM property_feature WHERE property_id = 'P001';
DELETE FROM property WHERE property_id = 'P001';
COMMIT;
```

### View Database Statistics

```sql
-- Count properties by type
SELECT listing_type, COUNT(*) as count 
FROM property 
GROUP BY listing_type;

-- Count properties by status
SELECT status, COUNT(*) as count 
FROM property 
GROUP BY status;

-- Average listing price
SELECT AVG(listing_price) as avg_price FROM property;
```

## Troubleshooting

### Website Shows "No Properties"

1. Check if database has data:
   ```sql
   SELECT COUNT(*) FROM property;
   ```
2. If empty, insert sample data (see above)
3. Refresh the website

### Can't Sign In

1. Check if user exists:
   ```sql
   SELECT * FROM agent WHERE email = 'your@email.com';
   SELECT * FROM buyer WHERE email = 'your@email.com';
   ```
2. Create account through website if doesn't exist

### Properties Not Filtering

1. Check server console for SQL errors
2. Verify data types in database match expected format
3. Check that `listing_type` is set correctly ('Sale' or 'Rent')

### Connection Issues

1. Verify `.env` file has correct credentials:
   ```env
   DB_USER=system
   DB_PASSWORD=your_password
   DB_CONNECTION_STRING=localhost:1521/XE
   ```
2. Test connection:
   ```bash
   node test-connection.js
   ```

## Tips

1. **Keep SQL Developer open** while testing - you can see data changes in real-time
2. **Use SQL queries** to verify website actions are saving correctly
3. **Check server console** to see all SQL queries being executed
4. **Refresh browser** after making database changes directly in SQL Developer
5. **Use COMMIT** after INSERT/UPDATE/DELETE in SQL Developer

## Next Steps

1. ✅ Create accounts through the website
2. ✅ List properties (they'll appear in database)
3. ✅ Test filters (watch SQL queries in server console)
4. ✅ View data in SQL Developer
5. ✅ Try updating properties directly in database, then refresh website

Enjoy using your Oracle-powered real estate website! 🏠

