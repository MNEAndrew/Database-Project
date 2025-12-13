# Update Your Database Password in .env File

## Current Issue

Your `.env` file has a placeholder password:
```env
DB_PASSWORD=your_password
```

You need to replace `your_password` with your **actual SYSTEM password**.

## How to Update

### Option 1: Edit .env File Manually

1. Open `.env` file in your project folder
2. Find the line: `DB_PASSWORD=your_password`
3. Replace `your_password` with your actual password
4. Save the file

Example:
```env
DB_USER=system
DB_PASSWORD=MyActualPassword123
DB_CONNECTION_STRING=//localhost:1521/FREEPDB1
PORT=3000
```

### Option 2: Use PowerShell (Replace YOUR_PASSWORD)

```powershell
(Get-Content .env) -replace 'your_password', 'YOUR_ACTUAL_PASSWORD' | Set-Content .env
```

## Verify Your Password

If you're not sure what your password is:

1. **Test with SQL*Plus:**
   ```cmd
   sqlplus /nolog
   connect system/YOUR_PASSWORD@//localhost:1521/FREEPDB1
   ```

2. **If it works in SQL*Plus**, use that same password in `.env`

3. **If you forgot your password**, reset it:
   ```cmd
   sqlplus / as sysdba
   ALTER USER system IDENTIFIED BY new_password;
   ```

## After Updating Password

1. **Test connection:**
   ```bash
   node test-connection.js
   ```

2. **Should see:**
   ```
   ✅ Successfully connected to Oracle database!
   ```

3. **Start server:**
   ```bash
   npm start
   ```

4. **Open website:**
   `http://localhost:3000`

## Security Note

⚠️ **Never commit `.env` file to Git!** It's already in `.gitignore`, but make sure your password is secure.

## Current .env Format

After updating password, your `.env` should look like:

```env
DB_USER=system
DB_PASSWORD=YourActualPasswordHere
DB_CONNECTION_STRING=//localhost:1521/FREEPDB1
PORT=3000
```

## Test Connection Command

After updating, test with:
```bash
node test-connection.js
```

If successful, you'll see:
- ✅ Successfully connected to Oracle database!
- 📊 Tables in database: ...
- 🏠 Properties in database: X
- 👤 Agents in database: X

