# Fix Listener Connection Issue

## Problem
Port 1521 is not accessible, which means the Oracle listener is either:
1. Not running
2. Running on a different port
3. Not configured correctly

## Solution Steps

### Step 1: Check Listener Status

Open Command Prompt as Administrator and run:
```cmd
lsnrctl status
```

**If listener is running**, you'll see:
```
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521)))
```

**If listener is NOT running**, you'll see an error.

### Step 2: Start the Listener

If the listener is not running:
```cmd
lsnrctl start
```

Wait for: `The listener supports no services`

### Step 3: Check What Port SQL Developer Uses

Since SQL Developer works for you:

1. In SQL Developer, right-click your connection "Database Zillow Pr..."
2. Click **Properties** (pencil icon)
3. Check the **Port** field
4. It might not be 1521!

### Step 4: Update .env with Correct Port

If SQL Developer uses a different port (like 1522, 1523, etc.), update your `.env`:

```env
DB_CONNECTION_STRING=localhost:ACTUAL_PORT/FREEPDB1
```

For example, if SQL Developer shows port 1522:
```env
DB_CONNECTION_STRING=localhost:1522/FREEPDB1
```

### Step 5: Alternative - Check Listener Configuration

The listener might be configured to listen on a different port. Check:

1. Find Oracle home:
   ```cmd
   echo %ORACLE_HOME%
   ```

2. Open listener.ora:
   ```
   %ORACLE_HOME%\network\admin\listener.ora
   ```

3. Look for:
   ```
   (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
   ```

4. Note the PORT number

### Step 6: Restart Listener

After checking/updating:
```cmd
lsnrctl stop
lsnrctl start
```

### Step 7: Verify Port is Open

```powershell
Test-NetConnection -ComputerName localhost -Port 1521
```

Should show: `TcpTestSucceeded : True`

## Quick Check: What Port Does SQL Developer Use?

**This is the easiest way to find the correct port:**

1. SQL Developer → Right-click connection → Properties
2. Look at the **Port** field
3. Use that exact port in your `.env` file

## Common Issues

### Issue 1: Listener Not Started
**Fix:** `lsnrctl start`

### Issue 2: Wrong Port
**Fix:** Check SQL Developer and use that port

### Issue 3: Listener on Different Host
**Fix:** Check if listener.ora has a different HOST

### Issue 4: Firewall Blocking
**Fix:** Allow port 1521 through Windows Firewall

## After Fixing

1. Test connection:
   ```bash
   node test-connection.js
   ```

2. Should see:
   ```
   ✅ Successfully connected to Oracle database!
   ```

3. Start server:
   ```bash
   npm start
   ```

## Still Not Working?

Try connecting with SQL*Plus first to verify the exact connection string:
```cmd
sqlplus /nolog
connect system/password@localhost:PORT/FREEPDB1
```

Replace PORT with the actual port number. Once SQL*Plus works, use that same connection string in `.env`.

