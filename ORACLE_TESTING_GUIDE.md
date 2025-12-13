# Oracle Database Testing Guide

This guide will help you set up and test the real estate website with Oracle database.

## Prerequisites

1. **Oracle Database** (one of the following):
   - Oracle Database Express Edition (XE) - Free, recommended for testing
   - Oracle Database Standard/Enterprise Edition
   - Oracle Cloud Autonomous Database (Free Tier available)

2. **Oracle Instant Client** - Required for Node.js to connect
3. **Node.js** (v14 or higher)
4. **npm** (comes with Node.js)

## Step 1: Install Oracle Database

### Option A: Oracle Database XE (Recommended for Testing)

1. Download Oracle Database XE from:
   https://www.oracle.com/database/technologies/oracle-database-software-downloads.html

2. Install Oracle XE:
   - Windows: Run the installer, follow setup wizard
   - Linux: Use package manager or install script
   - Note the password you set for the SYSTEM user

3. Default settings:
   - Port: 1521
   - Service Name: XE
   - Username: system
   - Password: (the one you set during installation)

### Option B: Oracle Cloud (Free Tier)

1. Sign up at: https://cloud.oracle.com/
2. Create an Autonomous Database
3. Download wallet files
4. Note connection details from the cloud console

## Step 2: Install Oracle Instant Client

### Windows

1. Download Instant Client Basic Package:
   https://www.oracle.com/database/technologies/instant-client/downloads.html

2. Extract to: `C:\oracle\instantclient_21_3` (or similar version)

3. Add to PATH:
   ```powershell
   # Run as Administrator
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\oracle\instantclient_21_3", "Machine")
   ```

4. Restart your terminal/IDE

### Linux

```bash
# Download and extract
unzip instantclient-basic-linux.x64-21.3.0.0.0dbru.zip
sudo mv instantclient_21_3 /opt/oracle/

# Set environment variable
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_3:$LD_LIBRARY_PATH

# Add to ~/.bashrc for persistence
echo 'export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_3:$LD_LIBRARY_PATH' >> ~/.bashrc
```

### macOS

```bash
# Using Homebrew
brew install instantclient-basic

# Or download and extract manually
export DYLD_LIBRARY_PATH=/path/to/instantclient:$DYLD_LIBRARY_PATH
```

## Step 3: Create Database Schema

1. Connect to Oracle using SQL*Plus or SQL Developer:

```bash
sqlplus system/your_password@localhost:1521/XE
```

2. Run the schema script:

```sql
@ddl_oracle.sql
```

Or copy and paste the contents of `ddl_oracle.sql` into SQL*Plus.

3. Verify tables were created:

```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

You should see:
- AGENT
- BUYER
- PROPERTY
- PROPERTY_TYPE
- PROPERTY_FEATURE
- SELLER
- OFFER
- etc.

## Step 4: Insert Sample Data (Optional)

You can insert sample data manually or use SQL scripts. Example:

```sql
-- Insert property types
INSERT INTO property_type (type_id, type_name) VALUES (1, 'Single Family');
INSERT INTO property_type (type_id, type_name) VALUES (2, 'Condo');
INSERT INTO property_type (type_id, type_name) VALUES (3, 'Townhouse');
INSERT INTO property_type (type_id, type_name) VALUES (4, 'Luxury');

-- Insert sample agents
INSERT INTO agent (agent_id, name, phone, email, license_number, commission_rate, hire_date)
VALUES ('A001', 'Sarah Johnson', '555-0101', 'sarah.j@realty.com', 'LIC-12345', 3.00, SYSDATE);

-- Insert sample properties
INSERT INTO property (property_id, address, city, state, zip_code, property_type_id,
                      bedrooms, bathrooms, square_feet, lot_size, year_built, listing_price,
                      listing_type, status, listing_date, description, listing_agent_id)
VALUES ('P001', '123 Oak Street', 'Springfield', 'IL', '62701', 1,
        3, 2.0, 1800, 0.25, 1995, 275000,
        'Sale', 'On Market', SYSDATE, 'Beautiful home', 'A001');
```

## Step 5: Configure Environment Variables

1. Create `.env` file in project root:

```env
DB_USER=system
DB_PASSWORD=your_password_here
DB_CONNECTION_STRING=localhost:1521/XE
PORT=3000
```

**For Oracle Cloud:**
```env
DB_USER=admin
DB_PASSWORD=your_wallet_password
DB_CONNECTION_STRING=your_connection_string_from_wallet
PORT=3000
```

## Step 6: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `oracledb` - Oracle database driver
- `dotenv` - Environment variables
- `multer` - File uploads

## Step 7: Test Database Connection

```bash
node test-connection.js
```

Expected output:
```
Testing Oracle database connection...
Connection String: localhost:1521/XE
User: system
✅ Successfully connected to Oracle database!

📊 Tables in database:
  - AGENT
  - BUYER
  - PROPERTY
  ...

🏠 Properties in database: X
👤 Agents in database: X

✅ Connection test completed successfully!
```

If you see errors:
- **ORA-12154**: Check connection string format
- **NJS-045**: Oracle Instant Client not found - add to PATH
- **ORA-01017**: Wrong username/password

## Step 8: Start the Server

```bash
npm start
```

Or:
```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Oracle database connection pool initialized
```

## Step 9: Test the Website

1. Open browser: `http://localhost:3000`

2. **Test Features:**
   - ✅ Create account (Realtor or Buyer) - saves to database
   - ✅ Sign in - authenticates from database
   - ✅ View properties - loads from database
   - ✅ Filter properties - uses SQL queries
   - ✅ List property - saves to database
   - ✅ View agents - loads from database
   - ✅ Update settings - updates database

3. **Check Database:**
   ```sql
   -- View all properties
   SELECT * FROM property;
   
   -- View all agents
   SELECT * FROM agent;
   
   -- View all buyers
   SELECT * FROM buyer;
   
   -- View properties with filters
   SELECT * FROM property WHERE listing_type = 'Rent';
   SELECT * FROM property WHERE listing_price > 300000;
   ```

## Step 10: Monitor SQL Queries

The server console will show all SQL queries being executed:

```
Executing SQL: SELECT p.*, pt.type_name as property_type, ...
With binds: { listingType: 'Rent', status: 'On Market' }
Found 6 properties
```

## Troubleshooting

### Connection Issues

**Error: ORA-12154: TNS:could not resolve the connect identifier**
- Check connection string format: `hostname:port/service_name`
- For XE: `localhost:1521/XE`
- Verify Oracle service is running

**Error: NJS-045: Oracle Client library not loaded**
- Install Oracle Instant Client
- Add to PATH (Windows) or LD_LIBRARY_PATH (Linux)
- Restart terminal/IDE

**Error: ORA-01017: invalid username/password**
- Verify credentials in `.env`
- Check if account is locked: `ALTER USER system ACCOUNT UNLOCK;`

### Performance Issues

- **Connection Pool**: Already configured in `server.js`
- **Query Optimization**: Indexes are created in `ddl_oracle.sql`
- **Large Datasets**: Use pagination (can be added to API)

### Data Issues

**Properties not showing:**
- Check if data exists: `SELECT COUNT(*) FROM property;`
- Verify `listing_type` is set correctly
- Check status: `SELECT DISTINCT status FROM property;`

**Users can't sign in:**
- Verify users exist: `SELECT * FROM agent; SELECT * FROM buyer;`
- Check email matches exactly (case-sensitive in Oracle)

## Advanced Testing

### Test SQL Queries Directly

```sql
-- Test property filtering
SELECT p.*, pt.type_name 
FROM property p
LEFT JOIN property_type pt ON p.property_type_id = pt.type_id
WHERE p.listing_type = 'Rent' AND p.status = 'On Market';

-- Test agent performance view
SELECT * FROM v_agent_performance;

-- Test properties on market view
SELECT * FROM v_properties_on_market;
```

### Load Testing

Use tools like Apache Bench or Postman to test API endpoints:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test properties endpoint
curl http://localhost:3000/api/properties

# Test with filters
curl "http://localhost:3000/api/properties?listingType=Rent&status=On%20Market"
```

## Database Maintenance

### Backup

```bash
# Export schema
expdp system/password@XE schemas=YOUR_SCHEMA directory=DATA_PUMP_DIR dumpfile=backup.dmp

# Or use SQL*Plus
exp system/password@XE file=backup.dmp
```

### Reset Database

```sql
-- Drop all tables (careful!)
BEGIN
   FOR cur_rec IN (SELECT object_name, object_type FROM user_objects WHERE object_type IN ('TABLE','VIEW','PACKAGE','SEQUENCE','PROCEDURE','FUNCTION')) LOOP
      BEGIN
         IF cur_rec.object_type = 'TABLE' THEN
            EXECUTE IMMEDIATE 'DROP ' || cur_rec.object_type || ' "' || cur_rec.object_name || '" CASCADE CONSTRAINTS';
         ELSE
            EXECUTE IMMEDIATE 'DROP ' || cur_rec.object_type || ' "' || cur_rec.object_name || '"';
         END IF;
      EXCEPTION
         WHEN OTHERS THEN NULL;
      END;
   END LOOP;
END;
/

-- Then re-run ddl_oracle.sql
```

## Next Steps

1. **Add More Data**: Insert more sample properties, agents, buyers
2. **Test All Features**: Create accounts, list properties, filter, etc.
3. **Monitor Performance**: Check query execution times
4. **Optimize Queries**: Add indexes if needed
5. **Add Security**: Implement password hashing, input validation
6. **Deploy**: Consider deploying to production environment

## Support

- Oracle Documentation: https://docs.oracle.com/en/database/
- Node.js Oracle Driver: https://oracle.github.io/node-oracledb/
- Project Issues: Check GitHub repository

