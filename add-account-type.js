// Add account_type column to existing tables
const oracledb = require('oracledb');
require('dotenv').config();

async function addAccountType() {
    let connection;
    
    try {
        console.log('Connecting to Oracle database...');
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        
        console.log('✅ Connected!\n');
        
        // Add account_type to agent table
        console.log('Adding account_type to agent table...');
        try {
            await connection.execute(`
                ALTER TABLE agent ADD (
                    account_type VARCHAR2(10) DEFAULT 'realtor' CHECK (account_type IN ('realtor', 'buyer'))
                )
            `);
            console.log('✅ Added account_type to agent table');
        } catch (err) {
            if (err.message.includes('ORA-01430')) {
                console.log('⚠️  account_type column already exists in agent table');
            } else {
                throw err;
            }
        }
        
        // Update existing agent records
        await connection.execute(`UPDATE agent SET account_type = 'realtor' WHERE account_type IS NULL`);
        console.log('✅ Updated existing agent records');
        
        // Add account_type to buyer table
        console.log('\nAdding account_type to buyer table...');
        try {
            await connection.execute(`
                ALTER TABLE buyer ADD (
                    account_type VARCHAR2(10) DEFAULT 'buyer' CHECK (account_type IN ('realtor', 'buyer'))
                )
            `);
            console.log('✅ Added account_type to buyer table');
        } catch (err) {
            if (err.message.includes('ORA-01430')) {
                console.log('⚠️  account_type column already exists in buyer table');
            } else {
                throw err;
            }
        }
        
        // Update existing buyer records
        await connection.execute(`UPDATE buyer SET account_type = 'buyer' WHERE account_type IS NULL`);
        console.log('✅ Updated existing buyer records');
        
        await connection.commit();
        console.log('\n✅ Successfully added account_type column to both tables!');
        
    } catch (err) {
        console.error('\n❌ Error:', err.message);
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

addAccountType();

