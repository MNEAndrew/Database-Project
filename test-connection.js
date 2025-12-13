// Test Oracle Database Connection
const oracledb = require('oracledb');
require('dotenv').config();

async function testConnection() {
    let connection;
    
    try {
        console.log('Testing Oracle database connection...');
        console.log('Connection String:', process.env.DB_CONNECTION_STRING);
        console.log('User:', process.env.DB_USER);
        
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        
        console.log('✅ Successfully connected to Oracle database!');
        
        // Test query - get tables
        const result = await connection.execute(
            'SELECT table_name FROM user_tables ORDER BY table_name',
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        console.log('\n📊 Tables in database:');
        if (result.rows && result.rows.length > 0) {
            result.rows.forEach(row => {
                console.log(`  - ${row.TABLE_NAME}`);
            });
        } else {
            console.log('  No tables found. Run ddl_oracle.sql to create schema.');
        }
        
        // Test query - get property count
        try {
            const propResult = await connection.execute(
                'SELECT COUNT(*) as count FROM property',
                {},
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(`\n🏠 Properties in database: ${propResult.rows[0].COUNT || 0}`);
        } catch (err) {
            console.log('\n⚠️  Property table not found or empty');
        }
        
        // Test query - get agent count
        try {
            const agentResult = await connection.execute(
                'SELECT COUNT(*) as count FROM agent',
                {},
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(`👤 Agents in database: ${agentResult.rows[0].COUNT || 0}`);
        } catch (err) {
            console.log('\n⚠️  Agent table not found or empty');
        }
        
        console.log('\n✅ Connection test completed successfully!');
        
    } catch (err) {
        console.error('\n❌ Connection failed!');
        console.error('Error:', err.message);
        
        if (err.errorNum === 1017) {
            console.error('\n💡 Tip: Check your username and password in .env file');
        } else if (err.errorNum === 12154) {
            console.error('\n💡 Tip: Check your connection string format');
            console.error('   Format: hostname:port/service_name');
            console.error('   Example: localhost:1521/XE');
        } else if (err.message.includes('NJS-045')) {
            console.error('\n💡 Tip: Oracle Instant Client not found');
            console.error('   1. Download Oracle Instant Client');
            console.error('   2. Add to PATH environment variable');
            console.error('   3. Restart terminal');
        }
        
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

// Run test
testConnection();

