-- Real Estate Database Schema (Oracle SQL)
-- CSE 4701 Project - Option 5: Real Estate Database (e.g., Zillow, Redfin)
-- Oracle SQL Dialect

-- Drop all tables in reverse order of dependencies (if they exist)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE offer CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE sale CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE viewing CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE property_feature CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE property CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE property_type CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE seller CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE buyer CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE agent CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- Agents table: Real estate agents who facilitate transactions
CREATE TABLE agent (
    agent_id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    phone VARCHAR2(15),
    email VARCHAR2(100),
    license_number VARCHAR2(20) NOT NULL UNIQUE,
    commission_rate NUMBER(5,2) CHECK (commission_rate >= 0 AND commission_rate <= 100),
    hire_date DATE
);

-- Buyers table: People looking to purchase properties
CREATE TABLE buyer (
    buyer_id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    phone VARCHAR2(15),
    email VARCHAR2(100),
    address VARCHAR2(200),
    city VARCHAR2(50),
    state VARCHAR2(2),
    zip_code VARCHAR2(10),
    budget_min NUMBER(12,2) CHECK (budget_min >= 0),
    budget_max NUMBER(12,2) CHECK (budget_max >= 0),
    preferred_bedrooms NUMBER(2,0) CHECK (preferred_bedrooms >= 0),
    preferred_bathrooms NUMBER(3,1) CHECK (preferred_bathrooms >= 0),
    registration_date DATE,
    CONSTRAINT budget_check CHECK (budget_max >= budget_min)
);

-- Sellers table: People selling properties
CREATE TABLE seller (
    seller_id VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    phone VARCHAR2(15),
    email VARCHAR2(100),
    address VARCHAR2(200),
    city VARCHAR2(50),
    state VARCHAR2(2),
    zip_code VARCHAR2(10),
    registration_date DATE
);

-- Property types lookup table
CREATE TABLE property_type (
    type_id VARCHAR2(10) PRIMARY KEY,
    type_name VARCHAR2(50) NOT NULL,
    description VARCHAR2(200)
);

-- Properties table: Real estate listings
CREATE TABLE property (
    property_id VARCHAR2(10) PRIMARY KEY,
    address VARCHAR2(200) NOT NULL,
    city VARCHAR2(50) NOT NULL,
    state VARCHAR2(2) NOT NULL,
    zip_code VARCHAR2(10) NOT NULL,
    property_type_id VARCHAR2(10),
    bedrooms NUMBER(2,0) CHECK (bedrooms >= 0),
    bathrooms NUMBER(3,1) CHECK (bathrooms >= 0),
    square_feet NUMBER(8,0) CHECK (square_feet > 0),
    lot_size NUMBER(10,2) CHECK (lot_size >= 0),
    year_built NUMBER(4,0) CHECK (year_built > 1800 AND year_built <= EXTRACT(YEAR FROM SYSDATE)),
    listing_price NUMBER(12,2) CHECK (listing_price > 0),
    status VARCHAR2(20) CHECK (status IN ('On Market', 'Pending', 'Sold', 'Off Market', 'Withdrawn')),
    listing_date DATE,
    description CLOB,
    seller_id VARCHAR2(10),
    listing_agent_id VARCHAR2(10),
    CONSTRAINT fk_property_type FOREIGN KEY (property_type_id) 
        REFERENCES property_type(type_id) ON DELETE SET NULL,
    CONSTRAINT fk_property_seller FOREIGN KEY (seller_id) 
        REFERENCES seller(seller_id) ON DELETE SET NULL,
    CONSTRAINT fk_property_agent FOREIGN KEY (listing_agent_id) 
        REFERENCES agent(agent_id) ON DELETE SET NULL
);

-- Property features table: Additional features of properties
CREATE TABLE property_feature (
    property_id VARCHAR2(10),
    feature_name VARCHAR2(50),
    PRIMARY KEY (property_id, feature_name),
    CONSTRAINT fk_feature_property FOREIGN KEY (property_id) 
        REFERENCES property(property_id) ON DELETE CASCADE
);

-- Viewings table: Records of buyers viewing properties
CREATE TABLE viewing (
    viewing_id VARCHAR2(10) PRIMARY KEY,
    property_id VARCHAR2(10) NOT NULL,
    buyer_id VARCHAR2(10) NOT NULL,
    agent_id VARCHAR2(10),
    viewing_date DATE NOT NULL,
    viewing_time TIMESTAMP,
    notes CLOB,
    interested CHAR(1) CHECK (interested IN ('Y', 'N')),
    CONSTRAINT fk_viewing_property FOREIGN KEY (property_id) 
        REFERENCES property(property_id) ON DELETE CASCADE,
    CONSTRAINT fk_viewing_buyer FOREIGN KEY (buyer_id) 
        REFERENCES buyer(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_viewing_agent FOREIGN KEY (agent_id) 
        REFERENCES agent(agent_id) ON DELETE SET NULL
);

-- Sales table: Completed property transactions
CREATE TABLE sale (
    sale_id VARCHAR2(10) PRIMARY KEY,
    property_id VARCHAR2(10) NOT NULL,
    buyer_id VARCHAR2(10) NOT NULL,
    seller_id VARCHAR2(10) NOT NULL,
    listing_agent_id VARCHAR2(10),
    buying_agent_id VARCHAR2(10),
    listing_price NUMBER(12,2) CHECK (listing_price > 0),
    sale_price NUMBER(12,2) CHECK (sale_price > 0),
    sale_date DATE NOT NULL,
    closing_date DATE,
    commission_amount NUMBER(12,2) CHECK (commission_amount >= 0),
    CONSTRAINT fk_sale_property FOREIGN KEY (property_id) 
        REFERENCES property(property_id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_buyer FOREIGN KEY (buyer_id) 
        REFERENCES buyer(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_seller FOREIGN KEY (seller_id) 
        REFERENCES seller(seller_id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_listing_agent FOREIGN KEY (listing_agent_id) 
        REFERENCES agent(agent_id) ON DELETE SET NULL,
    CONSTRAINT fk_sale_buying_agent FOREIGN KEY (buying_agent_id) 
        REFERENCES agent(agent_id) ON DELETE SET NULL,
    CONSTRAINT closing_date_check CHECK (closing_date IS NULL OR closing_date >= sale_date)
);

-- Offers table: Purchase offers made by buyers
CREATE TABLE offer (
    offer_id VARCHAR2(10) PRIMARY KEY,
    property_id VARCHAR2(10) NOT NULL,
    buyer_id VARCHAR2(10) NOT NULL,
    agent_id VARCHAR2(10),
    offer_amount NUMBER(12,2) CHECK (offer_amount > 0),
    offer_date DATE NOT NULL,
    expiration_date DATE,
    status VARCHAR2(20) CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Expired')),
    conditions CLOB,
    CONSTRAINT fk_offer_property FOREIGN KEY (property_id) 
        REFERENCES property(property_id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_buyer FOREIGN KEY (buyer_id) 
        REFERENCES buyer(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_agent FOREIGN KEY (agent_id) 
        REFERENCES agent(agent_id) ON DELETE SET NULL,
    CONSTRAINT expiration_date_check CHECK (expiration_date IS NULL OR expiration_date >= offer_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_property_status ON property(status);
CREATE INDEX idx_property_city ON property(city);
CREATE INDEX idx_property_price ON property(listing_price);
CREATE INDEX idx_property_type ON property(property_type_id);
CREATE INDEX idx_buyer_email ON buyer(email);
CREATE INDEX idx_agent_email ON agent(email);
CREATE INDEX idx_sale_date ON sale(sale_date);
CREATE INDEX idx_viewing_date ON viewing(viewing_date);

-- Create views for common queries

-- View: Properties on the market with agent information
CREATE OR REPLACE VIEW v_properties_on_market AS
SELECT 
    p.property_id,
    p.address,
    p.city,
    p.state,
    p.zip_code,
    p.listing_price,
    p.status,
    pt.type_name AS property_type,
    p.bedrooms,
    p.bathrooms,
    p.square_feet,
    p.lot_size,
    a.name AS agent_name,
    a.email AS agent_email,
    a.phone AS agent_phone
FROM property p
LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
LEFT JOIN property_type pt ON p.property_type_id = pt.type_id
WHERE p.status = 'On Market';

-- View: Agent performance summary
CREATE OR REPLACE VIEW v_agent_performance AS
SELECT 
    a.agent_id,
    a.name AS agent_name,
    a.license_number,
    COUNT(DISTINCT s.sale_id) AS total_sales,
    NVL(SUM(s.commission_amount), 0) AS total_commissions,
    COUNT(DISTINCT p.property_id) AS active_listings,
    AVG(s.sale_price) AS avg_sale_price
FROM agent a
LEFT JOIN sale s ON a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id
LEFT JOIN property p ON a.agent_id = p.listing_agent_id AND p.status = 'On Market'
GROUP BY a.agent_id, a.name, a.license_number;

-- View: Buyer purchase history
CREATE OR REPLACE VIEW v_buyer_purchase_history AS
SELECT 
    b.buyer_id,
    b.name AS buyer_name,
    b.email AS buyer_email,
    s.sale_id,
    p.address AS property_address,
    p.city,
    p.state,
    s.sale_price,
    s.sale_date,
    s.closing_date,
    a.name AS agent_name
FROM buyer b
JOIN sale s ON b.buyer_id = s.buyer_id
JOIN property p ON s.property_id = p.property_id
LEFT JOIN agent a ON s.buying_agent_id = a.agent_id
ORDER BY s.sale_date DESC;

-- View: Property features summary
CREATE OR REPLACE VIEW v_property_features AS
SELECT 
    p.property_id,
    p.address,
    p.city,
    p.state,
    LISTAGG(pf.feature_name, ', ') WITHIN GROUP (ORDER BY pf.feature_name) AS features
FROM property p
LEFT JOIN property_feature pf ON p.property_id = pf.property_id
GROUP BY p.property_id, p.address, p.city, p.state;

COMMIT;

