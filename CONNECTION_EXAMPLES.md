# Oracle Connection String Examples

## Your Database Connection

Based on your SQL*Plus command, your connection details are:
- **Service Name**: `FREEPDB1`
- **Host**: `localhost`
- **Port**: `1521`
- **Format**: `//localhost:1521/FREEPDB1`

## Connection String Formats

### For .env File (Node.js)
```env
DB_CONNECTION_STRING=localhost:1521/FREEPDB1
```

### For SQL*Plus
```sql
sqlplus /nolog
connect user/password@//localhost:1521/FREEPDB1
```

### For SQL Developer
- **Connection Type**: Basic
- **Hostname**: `localhost`
- **Port**: `1521`
- **Service Name**: `FREEPDB1`
- **Username**: `system` (or your username)
- **Password**: (your password)

### For Node.js (oracledb)
```javascript
const connection = await oracledb.getConnection({
    user: 'system',
    password: 'your_password',
    connectString: 'localhost:1521/FREEPDB1'
});
```

## Alternative Formats

### Using SID (if needed)
```env
DB_CONNECTION_STRING=localhost:1521:FREEPDB1
```

### Using TNS Format
```env
DB_CONNECTION_STRING=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=FREEPDB1)))
```

### Easy Connect Format (what you're using)
```env
DB_CONNECTION_STRING=//localhost:1521/FREEPDB1
```

## Testing Connections

### Test with SQL*Plus
```cmd
sqlplus /nolog
connect system/your_password@//localhost:1521/FREEPDB1
```

### Test with Node.js
```bash
node test-connection.js
```

### Test with SQL Developer
1. Click **Test** button in connection properties
2. Should show "Status: Success"

## Common Issues

### If connection fails:
1. **Check service name**: Make sure it's exactly `FREEPDB1`
2. **Check password**: Verify it matches your SQL Developer password
3. **Check listener**: Run `lsnrctl status` to verify listener is running
4. **Check port**: Verify port 1521 is correct

### Verify Service Name
```sql
-- Connect as SYSDBA
sqlplus / as sysdba

-- Check services
SELECT name FROM v$services;
```

## Your Current Setup

✅ Service Name: `FREEPDB1`
✅ Host: `localhost`
✅ Port: `1521`
✅ Format: Easy Connect (`//host:port/service`)

Your `.env` file should now have:
```env
DB_CONNECTION_STRING=localhost:1521/FREEPDB1
```

Or you can use the Easy Connect format:
```env
DB_CONNECTION_STRING=//localhost:1521/FREEPDB1
```

Both should work!

