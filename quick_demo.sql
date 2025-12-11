-- Quick Demo Script for Real Estate Database
-- Run this after setting up the database with dropddl.sql and largeInsert.sql

-- ============================================
-- QUICK DEMO: Essential Queries
-- ============================================

-- 1. VIEW ALL PROPERTIES ON THE MARKET
SELECT 
    p.property_id,
    p.address,
    p.city,
    pt.type_name AS type,
    p.bedrooms,
    p.bathrooms,
    p.listing_price,
    p.status,
    a.name AS agent
FROM property p
JOIN property_type pt ON p.property_type_id = pt.type_id
LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
WHERE p.status = 'On Market'
ORDER BY p.listing_price DESC;

-- 2. VIEW RECENTLY SOLD PROPERTIES
SELECT 
    p.address,
    p.listing_price,
    s.sale_price,
    s.sale_date,
    buyer.name AS buyer,
    seller.name AS seller
FROM sale s
JOIN property p ON s.property_id = p.property_id
JOIN buyer ON s.buyer_id = buyer.buyer_id
JOIN seller ON s.seller_id = seller.seller_id
ORDER BY s.sale_date DESC
LIMIT 10;

-- 3. VIEW PENDING OFFERS
SELECT 
    p.address,
    p.listing_price,
    o.offer_amount,
    o.status,
    b.name AS buyer,
    a.name AS agent
FROM offer o
JOIN property p ON o.property_id = p.property_id
JOIN buyer b ON o.buyer_id = b.buyer_id
LEFT JOIN agent a ON o.agent_id = a.agent_id
WHERE o.status = 'Pending'
ORDER BY o.offer_date DESC;

-- 4. AGENT PERFORMANCE SUMMARY
SELECT 
    a.name AS agent_name,
    COUNT(DISTINCT s.sale_id) AS total_sales,
    COALESCE(SUM(s.commission_amount), 0) AS total_commissions,
    COUNT(DISTINCT p.property_id) AS active_listings
FROM agent a
LEFT JOIN sale s ON (a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id)
LEFT JOIN property p ON a.agent_id = p.listing_agent_id AND p.status = 'On Market'
GROUP BY a.agent_id, a.name
ORDER BY total_commissions DESC;

-- 5. PROPERTIES WITH MULTIPLE INTERESTED BUYERS (Concurrent Transactions)
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    COUNT(DISTINCT v.buyer_id) AS number_of_viewers,
    COUNT(DISTINCT o.buyer_id) AS number_of_offers
FROM property p
LEFT JOIN viewing v ON p.property_id = v.property_id
LEFT JOIN offer o ON p.property_id = o.property_id
WHERE p.status IN ('On Market', 'Pending')
GROUP BY p.property_id, p.address, p.listing_price
HAVING COUNT(DISTINCT v.buyer_id) > 1
ORDER BY number_of_viewers DESC;

-- 6. BUYER ACTIVITY SUMMARY
SELECT 
    b.name AS buyer_name,
    b.budget_min,
    b.budget_max,
    COUNT(DISTINCT v.viewing_id) AS viewings,
    COUNT(DISTINCT o.offer_id) AS offers,
    COUNT(DISTINCT s.sale_id) AS purchases
FROM buyer b
LEFT JOIN viewing v ON b.buyer_id = v.buyer_id
LEFT JOIN offer o ON b.buyer_id = o.buyer_id
LEFT JOIN sale s ON b.buyer_id = s.buyer_id
GROUP BY b.buyer_id, b.name, b.budget_min, b.budget_max
ORDER BY viewings DESC;

-- 7. PROPERTIES BY TYPE
SELECT 
    pt.type_name,
    COUNT(p.property_id) AS total,
    AVG(p.listing_price) AS avg_price,
    MIN(p.listing_price) AS min_price,
    MAX(p.listing_price) AS max_price
FROM property_type pt
LEFT JOIN property p ON pt.type_id = p.property_type_id
GROUP BY pt.type_name
ORDER BY avg_price DESC;

-- 8. PROPERTIES WITH FEATURES
SELECT 
    p.address,
    p.listing_price,
    pf.feature_name
FROM property p
JOIN property_feature pf ON p.property_id = pf.property_id
WHERE p.status = 'On Market'
ORDER BY p.listing_price DESC;

-- 9. SALES STATISTICS
SELECT 
    COUNT(s.sale_id) AS total_sales,
    SUM(s.sale_price) AS total_volume,
    AVG(s.sale_price) AS avg_sale_price,
    SUM(s.commission_amount) AS total_commissions
FROM sale s;

-- 10. TOP AGENTS BY SALES
SELECT 
    a.name,
    COUNT(DISTINCT s.sale_id) AS sales_count,
    SUM(s.commission_amount) AS total_commissions
FROM agent a
JOIN sale s ON (a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id)
GROUP BY a.agent_id, a.name
ORDER BY total_commissions DESC
LIMIT 5;

