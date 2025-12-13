# Quick Start Guide - Oracle Database Demo

## Prerequisites Checklist

- [ ] Oracle Database installed and running
- [ ] Oracle Instant Client installed
- [ ] Node.js installed (v14+)
- [ ] Database schema created (ddl_oracle.sql)
- [ ] Sample data inserted

## Step-by-Step Setup

### 1. Install Oracle Database

**Option A: Oracle XE (Recommended for Demo)**
```bash
# Download from: https://www.oracle.com/database/technologies/oracle-database-software-downloads.html
# Install and note:
# - Username: system
# - Password: (your password)
# - Port: 1521
# - Service: XE
```

**Option B: Oracle Cloud (Free Tier)**
- Sign up at cloud.oracle.com
- Create Autonomous Database
- Download wallet files

### 2. Install Oracle Instant Client

**Windows:**
1. Download Instant Client Basic Package
2. Extract to `C:\oracle\instantclient_21_3`
3. Add to PATH:
   ```powershell
   setx PATH "%PATH%;C:\oracle\instantclient_21_3"
   ```

**Linux/Mac:**
```bash
export LD_LIBRARY_PATH=/path/to/instantclient:$LD_LIBRARY_PATH
```

### 3. Create Database Schema

```bash
# Connect to Oracle
sqlplus system/your_password@localhost:1521/XE

# Run schema script
@ddl_oracle.sql

# Verify
SELECT table_name FROM user_tables;
```

### 4. Insert Sample Data

```sql
-- Adapt largeInsert.sql for Oracle (minor syntax changes may be needed)
-- Or manually insert test data
```

### 5. Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
# DB_USER=system
# DB_PASSWORD=your_password
# DB_CONNECTION_STRING=localhost:1521/XE
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Test Connection

```bash
node test-connection.js
```

### 8. Start Server

```bash
npm start
```

Server runs on: `http://localhost:3000`

### 9. Open Application

Open browser to: `http://localhost:3000`

## Troubleshooting

**"ORA-12154: TNS:could not resolve"**
- Check connection string format
- Verify Oracle service is running

**"NJS-045: Oracle Client library not loaded"**
- Install Oracle Instant Client
- Add to PATH
- Restart terminal

**"Module not found: oracledb"**
```bash
npm install oracledb
```

## Demo Checklist

Before demo:
- [ ] Database schema created
- [ ] Sample data inserted
- [ ] Server running (npm start)
- [ ] Browser opens to localhost:3000
- [ ] Can create user accounts
- [ ] Can view properties
- [ ] Can list new properties

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `GET /api/agents` - Get all agents
- `POST /api/users/signup` - Create account
- `POST /api/users/signin` - Sign in

## Notes

- Frontend automatically uses API if available
- Falls back to localStorage if API unavailable
- All data stored in Oracle database
- Images stored as base64 in database (or use BLOB in production)

