# After Oracle Reinstall - Connection Setup

## After Reinstalling Oracle

The service name might have changed. Common service names after reinstall:

### Option 1: XE (Express Edition)
```env
DB_CONNECTION_STRING=localhost:1521/XE
```

### Option 2: FREE (Database Free)
```env
DB_CONNECTION_STRING=localhost:1521/FREE
```

### Option 3: FREEPDB1 (Pluggable Database)
```env
DB_CONNECTION_STRING=localhost:1521/FREEPDB1
```

## Steps to Find Your Service Name

### Method 1: Check SQL Developer
1. Create a new connection in SQL Developer
2. Try connecting with different service names:
   - `XE`
   - `FREE`
   - `FREEPDB1`
3. Whichever works, use that in `.env`

### Method 2: Check Listener Status
```cmd
lsnrctl status
```

Look for output like:
```
Service "XE" has 1 instance(s).
Service "FREE" has 1 instance(s).
Service "FREEPDB1" has 1 instance(s).
```

### Method 3: Connect as SYSDBA
```cmd
sqlplus / as sysdba
```

Then run:
```sql
SELECT name FROM v$services;
```

## Start the Listener

If listener is not running:
```cmd
lsnrctl start
```

Verify it's running:
```cmd
lsnrctl status
```

Should show:
```
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521)))
```

## Test Connection

After updating service name and starting listener:

```bash
node test-connection.js
```

## Common Issues After Reinstall

### Issue 1: Service Name Changed
**Solution:** Try XE, FREE, or FREEPDB1

### Issue 2: Listener Not Started
**Solution:** Run `lsnrctl start`

### Issue 3: Password Changed
**Solution:** Use the password you set during reinstall

### Issue 4: Port Different
**Solution:** Check SQL Developer for the actual port

## Quick Test Commands

```cmd
# Test with XE
sqlplus system/password@localhost:1521/XE

# Test with FREE
sqlplus system/password@localhost:1521/FREE

# Test with FREEPDB1
sqlplus system/password@localhost:1521/FREEPDB1
```

Whichever works, use that service name in your `.env` file!


