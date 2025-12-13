-- Add account_type column to existing tables
-- Run this if you already have tables created

-- Add account_type to agent table
ALTER TABLE agent ADD (
    account_type VARCHAR2(10) DEFAULT 'realtor' CHECK (account_type IN ('realtor', 'buyer'))
);

-- Update existing agent records
UPDATE agent SET account_type = 'realtor' WHERE account_type IS NULL;

-- Add account_type to buyer table
ALTER TABLE buyer ADD (
    account_type VARCHAR2(10) DEFAULT 'buyer' CHECK (account_type IN ('realtor', 'buyer'))
);

-- Update existing buyer records
UPDATE buyer SET account_type = 'buyer' WHERE account_type IS NULL;

COMMIT;

