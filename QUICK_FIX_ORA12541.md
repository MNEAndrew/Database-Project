# Quick Fix for ORA-12541 Error

## ✅ Good News: Your Oracle Services Are Running!

I checked your system and found:
- ✅ `OracleServiceFREE` - Running
- ✅ `OracleOraDB23Home1TNSListener` - Running

## The Problem

Your connection string is probably using `XE` but your database is `FREE`.

## Solution: Update Your Connection String

### Step 1: Check Your .env File

Your `.env` file should have:

```env
DB_USER=system
DB_PASSWORD=your_password
DB_CONNECTION_STRING=localhost:1521/FREE
PORT=3000
```

**Important:** Use `FREE` instead of `XE`!

### Step 2: Test the Connection

Run this to test:
```bash
node test-connection.js
```

### Step 3: Update SQL Developer Connection

In SQL Developer:
1. Right-click your connection "Database Zillow Pr..."
2. Click **Properties** (pencil icon)
3. Change **Service Name** from `XE` to `FREE`
4. Click **Test** → Should work now!
5. Click **Save**

### Alternative Connection Strings to Try

If `FREE` doesn't work, try:

```env
# Option 1: Using SID instead of Service Name
DB_CONNECTION_STRING=localhost:1521:FREE

# Option 2: Using full TNS format
DB_CONNECTION_STRING=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=FREE)))

# Option 3: Try with your computer name
DB_CONNECTION_STRING=YOUR_COMPUTER_NAME:1521/FREE
```

### Step 4: Verify Listener is Listening on Port 1521

```cmd
lsnrctl status
```

Look for:
```
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521)))
```

### Step 5: Test with SQL*Plus

```cmd
sqlplus system/your_password@localhost:1521/FREE
```

If this works, your connection string is correct!

## Still Not Working?

### Check What Service Name Your Database Uses

1. Connect as SYSDBA:
   ```cmd
   sqlplus / as sysdba
   ```

2. Check service name:
   ```sql
   SELECT name, value FROM v$parameter WHERE name = 'service_names';
   ```

3. Or check all services:
   ```sql
   SELECT name FROM v$services;
   ```

### Common Service Names:
- `FREE` - Oracle Database Free
- `XE` - Oracle Express Edition
- `ORCL` - Oracle Standard/Enterprise default
- `PDB1` - Pluggable Database

## Quick Test

Run this command to test connection:
```bash
node -e "const oracledb = require('oracledb'); require('dotenv').config(); oracledb.getConnection({user: process.env.DB_USER, password: process.env.DB_PASSWORD, connectString: process.env.DB_CONNECTION_STRING}).then(c => {console.log('✅ Connected!'); c.close();}).catch(e => console.log('❌ Error:', e.message));"
```

## After Fixing

1. Restart your server:
   ```bash
   npm start
   ```

2. Test the website:
   - Open `http://localhost:3000`
   - Try creating an account
   - Check if it saves to database

3. Verify in SQL Developer:
   - Run: `SELECT * FROM agent;`
   - Should see your new account!

