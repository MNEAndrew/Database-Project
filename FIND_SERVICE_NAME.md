# How to Find Your Oracle Service Name

## Method 1: Check in SQL Developer

1. In SQL Developer, right-click your connection "Database Zillow Pr..."
2. Click **Properties** (pencil icon)
3. Look at the **Service Name** or **SID** field
4. That's your service name!

## Method 2: Using SQL*Plus

1. Open Command Prompt
2. Connect as SYSDBA:
   ```cmd
   sqlplus / as sysdba
   ```
   
3. Run this query:
   ```sql
   SELECT name FROM v$services;
   ```
   
4. You'll see something like:
   ```
   FREE
   FREEPDB1
   ```
   
5. Use the first one (usually `FREE` or `FREEPDB1`)

## Method 3: Check Listener Status

```cmd
lsnrctl status
```

Look for output like:
```
Service "FREE" has 1 instance(s).
  Instance "FREE", status READY, has 1 handler(s) for this service...
```

The service name is `FREE` in this example.

## Method 4: Check tnsnames.ora

1. Find your Oracle home:
   ```cmd
   echo %ORACLE_HOME%
   ```

2. Open: `%ORACLE_HOME%\network\admin\tnsnames.ora`

3. Look for entries like:
   ```
   FREE =
     (DESCRIPTION =
       (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
       (CONNECT_DATA =
         (SERVER = DEDICATED)
         (SERVICE_NAME = FREE)
       )
     )
   ```

## Common Service Names for Oracle Database Free

- `FREE` - Most common
- `FREEPDB1` - Pluggable database
- `FREE.localdomain` - With domain

## Update Your .env File

Once you find your service name, update `.env`:

```env
DB_CONNECTION_STRING=localhost:1521/YOUR_SERVICE_NAME
```

For example:
```env
DB_CONNECTION_STRING=localhost:1521/FREE
# or
DB_CONNECTION_STRING=localhost:1521/FREEPDB1
```

## Test Connection

After updating, test:
```bash
node test-connection.js
```

Or test with SQL*Plus:
```cmd
sqlplus system/your_password@localhost:1521/FREE
```

