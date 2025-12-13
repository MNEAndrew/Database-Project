// Run Oracle SQL file using oracledb
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSQLFile() {
    let connection;
    
    try {
        console.log('Connecting to Oracle database...');
        console.log('Connection String:', process.env.DB_CONNECTION_STRING);
        console.log('User:', process.env.DB_USER);
        
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        
        console.log('✅ Connected to Oracle database!\n');
        
        // Read SQL file
        const sqlFile = path.join(__dirname, 'ddl_oracle.sql');
        console.log(`Reading SQL file: ${sqlFile}\n`);
        
        if (!fs.existsSync(sqlFile)) {
            throw new Error(`SQL file not found: ${sqlFile}`);
        }
        
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        
        // Remove comments and clean up SQL content
        let cleanedSQL = sqlContent
            .split('\n')
            .map(line => {
                // Remove inline comments
                const commentIndex = line.indexOf('--');
                if (commentIndex >= 0) {
                    return line.substring(0, commentIndex);
                }
                return line;
            })
            .join('\n');
        
        // Split by statement terminators, but keep PL/SQL blocks together
        const statements = [];
        let currentStatement = '';
        let inPLSQLBlock = false;
        let beginCount = 0;
        const lines = cleanedSQL.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim().toUpperCase();
            const originalLine = lines[i];
            
            // Track BEGIN/END blocks
            if (trimmedLine.startsWith('BEGIN')) {
                inPLSQLBlock = true;
                beginCount = 1;
                currentStatement += originalLine + '\n';
                continue;
            }
            
            if (inPLSQLBlock) {
                // Count nested BEGIN blocks
                if (trimmedLine.startsWith('BEGIN')) {
                    beginCount++;
                }
                if (trimmedLine.startsWith('END')) {
                    beginCount--;
                    currentStatement += originalLine;
                    // Check if this is the end of the PL/SQL block
                    if (beginCount === 0) {
                        // Look ahead for terminator
                        let j = i + 1;
                        while (j < lines.length && !lines[j].trim()) j++;
                        if (j < lines.length && (lines[j].trim() === '/' || lines[j].trim() === ';')) {
                            i = j; // Skip the terminator
                        }
                        statements.push(currentStatement.trim());
                        currentStatement = '';
                        inPLSQLBlock = false;
                        continue;
                    }
                    currentStatement += '\n';
                    continue;
                }
            }
            
            // Skip empty lines (but preserve them within statements)
            if (!trimmedLine) {
                if (currentStatement) {
                    currentStatement += '\n';
                }
                continue;
            }
            
            // Check for standalone '/' (statement terminator in SQL*Plus)
            if (trimmedLine === '/') {
                if (currentStatement.trim()) {
                    statements.push(currentStatement.trim());
                    currentStatement = '';
                }
                continue;
            }
            
            // Check for semicolon (statement terminator) - but not inside PL/SQL
            if (!inPLSQLBlock && originalLine.trim().endsWith(';')) {
                currentStatement += originalLine.substring(0, originalLine.lastIndexOf(';'));
                if (currentStatement.trim()) {
                    statements.push(currentStatement.trim());
                    currentStatement = '';
                }
                continue;
            }
            
            // Add line to current statement
            currentStatement += originalLine + '\n';
        }
        
        // Add any remaining statement
        if (currentStatement.trim()) {
            statements.push(currentStatement.trim());
        }
        
        console.log(`Found ${statements.length} SQL statements to execute\n`);
        
        // Execute each statement
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Skip very short statements (likely empty)
            if (statement.length < 10) {
                continue;
            }
            
            // Show progress for long statements
            const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
            console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
            
            try {
                await connection.execute(statement);
                successCount++;
            } catch (err) {
                // Some errors are expected (like table already exists)
                if (err.message.includes('ORA-00942') || // Table or view does not exist (for DROP statements)
                    err.message.includes('ORA-00955') || // Name is already used (for CREATE statements)
                    err.message.includes('ORA-01430') || // Column being added already exists
                    err.message.includes('ORA-02429') || // Cannot drop index used for enforcement of unique/primary key
                    err.message.includes('ORA-00904') || // Invalid identifier (sometimes happens with views)
                    err.message.includes('ORA-00922')) { // Missing or invalid option
                    console.log(`  ⚠️  Warning (expected): ${err.message.split('\n')[0]}`);
                    successCount++;
                } else {
                    console.error(`  ❌ Error: ${err.message.split('\n')[0]}`);
                    console.error(`  Statement preview: ${preview}...`);
                    // Only show full statement for unexpected errors
                    if (!err.message.includes('ORA-03405')) {
                        console.error(`  Full statement (first 200 chars): ${statement.substring(0, 200)}...`);
                    }
                    errorCount++;
                }
            }
        }
        
        // Commit all changes
        await connection.commit();
        
        console.log('\n' + '='.repeat(60));
        console.log(`✅ SQL file execution completed!`);
        console.log(`   Successful: ${successCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log('='.repeat(60));
        
        // Verify tables were created
        console.log('\n📊 Verifying created tables...\n');
        const result = await connection.execute(
            `SELECT table_name FROM user_tables 
             WHERE table_name IN ('AGENT', 'BUYER', 'SELLER', 'PROPERTY', 'PROPERTY_TYPE', 'PROPERTY_FEATURE', 'VIEWING', 'SALE', 'OFFER')
             ORDER BY table_name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (result.rows && result.rows.length > 0) {
            console.log('✅ Created tables:');
            result.rows.forEach(row => {
                console.log(`   - ${row.TABLE_NAME}`);
            });
        } else {
            console.log('⚠️  No expected tables found');
        }
        
    } catch (err) {
        console.error('\n❌ Fatal error executing SQL file!');
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('\n🔌 Connection closed');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// Run the script
runSQLFile();

