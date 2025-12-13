# Oracle Database Setup Guide

This guide will help you set up Oracle database and connect it to the Real Estate web application.

## Prerequisites

1. **Oracle Database** installed and running
   - Oracle Database Express Edition (XE) - Free version
   - Or Oracle Database Standard/Enterprise Edition
   - Download from: https://www.oracle.com/database/technologies/oracle-database-software-downloads.html

2. **Node.js** installed (v14 or higher)
   - Download from: https://nodejs.org/

3. **Oracle Instant Client** (for Node.js)
   - Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html

## Step 1: Install Oracle Database

### Option A: Oracle Database Express Edition (XE) - Recommended for Development

1. Download Oracle XE from Oracle website
2. Install following the installation wizard
3. Note your:
   - Username (usually `SYSTEM` or `SYS`)
   - Password (set during installation)
   - Port (usually `1521`)
   - Service name (usually `XE`)

### Option B: Oracle Cloud (Free Tier)

1. Sign up for Oracle Cloud Free Tier
2. Create an Autonomous Database
3. Download wallet files
4. Note connection details

## Step 2: Install Oracle Instant Client

1. Download Oracle Instant Client Basic Package for your OS
2. Extract to a directory (e.g., `C:\oracle\instantclient_21_3` on Windows)
3. Add to PATH environment variable

**Windows:**
```powershell
# Add to system PATH
setx PATH "%PATH%;C:\oracle\instantclient_21_3"
```

**Linux/Mac:**
```bash
export LD_LIBRARY_PATH=/path/to/instantclient_21_3:$LD_LIBRARY_PATH
```

## Step 3: Create Database Schema

1. Connect to Oracle using SQL*Plus or SQL Developer:
```bash
sqlplus system/your_password@localhost:1521/XE
```

2. Run the Oracle DDL script:
```sql
@ddl_oracle.sql
```

Or copy and paste the contents of `ddl_oracle.sql` into SQL*Plus.

3. Verify tables were created:
```sql
SELECT table_name FROM user_tables;
```

## Step 4: Insert Sample Data

1. Run the insert script (you may need to adapt `largeInsert.sql` for Oracle):
```sql
-- Run largeInsert.sql (may need minor syntax adjustments)
@largeInsert.sql
```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your Oracle credentials:
```
DB_USER=system
DB_PASSWORD=your_password
DB_CONNECTION_STRING=localhost:1521/XE
PORT=3000
```

**Connection String Formats:**
- Local XE: `localhost:1521/XE`
- Remote: `hostname:1521/service_name`
- Cloud: Use TNS name from wallet

## Step 6: Install Node.js Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `oracledb` - Oracle database driver
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `multer` - File upload handling
- `dotenv` - Environment variables

## Step 7: Test Database Connection

Create a test file `test-connection.js`:

```javascript
const oracledb = require('oracledb');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        
        console.log('✅ Successfully connected to Oracle database!');
        
        const result = await connection.execute('SELECT * FROM user_tables');
        console.log('Tables:', result.rows);
        
        await connection.close();
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();
```

Run it:
```bash
node test-connection.js
```

## Step 8: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Step 9: Update Frontend to Use API

The frontend JavaScript needs to be updated to call the API instead of using localStorage. The API endpoints are:

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `GET /api/agents` - Get all agents
- `POST /api/users/signup` - Create user account
- `POST /api/users/signin` - Sign in user
- `GET /api/users` - Get all users

## Troubleshooting

### Error: "ORA-12154: TNS:could not resolve the connect identifier"

**Solution:**
- Check your connection string format
- Verify Oracle service is running
- Check firewall settings

### Error: "ORA-01017: invalid username/password"

**Solution:**
- Verify credentials in `.env` file
- Try connecting with SQL*Plus first
- Check if account is locked

### Error: "NJS-045: Oracle Client library is not loaded"

**Solution:**
- Install Oracle Instant Client
- Add to PATH/LD_LIBRARY_PATH
- Restart terminal/IDE

### Error: "Module not found: oracledb"

**Solution:**
```bash
npm install oracledb
```

### Port Already in Use

**Solution:**
- Change PORT in `.env` file
- Or kill process using port 3000

## Oracle SQL Developer Alternative

If you prefer a GUI:
1. Download SQL Developer: https://www.oracle.com/tools/downloads/sqldev-downloads.html
2. Create new connection with your credentials
3. Run scripts through SQL Developer

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure database (edit .env)
# Edit .env with your Oracle credentials

# 3. Create schema
sqlplus system/password@localhost:1521/XE @ddl_oracle.sql

# 4. Insert sample data
sqlplus system/password@localhost:1521/XE @largeInsert.sql

# 5. Start server
npm start

# 6. Open browser
# http://localhost:3000
```

## Production Considerations

For production deployment:
1. Use connection pooling (already configured)
2. Set up proper authentication
3. Use HTTPS
4. Configure CORS properly
5. Add rate limiting
6. Use environment-specific `.env` files
7. Set up database backups
8. Monitor connection pool usage

## Additional Resources

- Oracle Node.js Driver: https://oracle.github.io/node-oracledb/
- Oracle Database Documentation: https://docs.oracle.com/en/database/
- Express.js Documentation: https://expressjs.com/

