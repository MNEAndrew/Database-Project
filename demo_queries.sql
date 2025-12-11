-- Real Estate Database Demo Queries
-- This file contains sample queries to demonstrate the database functionality

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- 1. Run dropddl.sql to create the schema
-- 2. Run largeInsert.sql (or smallInsert.sql) to populate with data
-- 3. Run the queries below to demonstrate functionality

-- ============================================
-- BASIC DEMONSTRATION QUERIES
-- ============================================

-- 1. Show all properties currently on the market
SELECT 
    p.property_id,
    p.address,
    p.city,
    p.state,
    pt.type_name AS property_type,
    p.bedrooms,
    p.bathrooms,
    p.square_feet,
    p.listing_price,
    p.status,
    a.name AS listing_agent,
    s.name AS seller_name
FROM property p
JOIN property_type pt ON p.property_type_id = pt.type_id
LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
LEFT JOIN seller s ON p.seller_id = s.seller_id
WHERE p.status = 'On Market'
ORDER BY p.listing_price DESC;

-- 2. Show recently sold properties with sale details
SELECT 
    s.sale_id,
    p.address,
    p.city,
    p.listing_price,
    s.sale_price,
    (s.listing_price - s.sale_price) AS price_difference,
    s.sale_date,
    s.closing_date,
    buyer.name AS buyer_name,
    seller.name AS seller_name,
    listing_agent.name AS listing_agent,
    buying_agent.name AS buying_agent,
    s.commission_amount
FROM sale s
JOIN property p ON s.property_id = p.property_id
JOIN buyer ON s.buyer_id = buyer.buyer_id
JOIN seller ON s.seller_id = seller.seller_id
LEFT JOIN agent listing_agent ON s.listing_agent_id = listing_agent.agent_id
LEFT JOIN agent buying_agent ON s.buying_agent_id = buying_agent.agent_id
ORDER BY s.sale_date DESC;

-- 3. Show properties with pending offers
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    o.offer_amount,
    (o.offer_amount - p.listing_price) AS offer_difference,
    o.offer_date,
    o.expiration_date,
    o.status,
    b.name AS buyer_name,
    a.name AS agent_name
FROM offer o
JOIN property p ON o.property_id = p.property_id
JOIN buyer b ON o.buyer_id = b.buyer_id
LEFT JOIN agent a ON o.agent_id = a.agent_id
WHERE o.status = 'Pending'
ORDER BY o.offer_date DESC;

-- 4. Show agent performance (sales and commissions)
SELECT 
    a.agent_id,
    a.name AS agent_name,
    a.commission_rate,
    COUNT(DISTINCT s.sale_id) AS total_sales,
    COALESCE(SUM(s.commission_amount), 0) AS total_commissions,
    COALESCE(SUM(s.sale_price), 0) AS total_sales_volume,
    COUNT(DISTINCT p.property_id) AS active_listings
FROM agent a
LEFT JOIN sale s ON (a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id)
LEFT JOIN property p ON a.agent_id = p.listing_agent_id AND p.status = 'On Market'
GROUP BY a.agent_id, a.name, a.commission_rate
ORDER BY total_commissions DESC;

-- 5. Show buyers and their viewing history
SELECT 
    b.buyer_id,
    b.name AS buyer_name,
    b.budget_min,
    b.budget_max,
    COUNT(DISTINCT v.viewing_id) AS total_viewings,
    COUNT(DISTINCT CASE WHEN v.interested = 'Y' THEN v.viewing_id END) AS interested_viewings,
    COUNT(DISTINCT o.offer_id) AS offers_made,
    COUNT(DISTINCT s.sale_id) AS properties_purchased
FROM buyer b
LEFT JOIN viewing v ON b.buyer_id = v.buyer_id
LEFT JOIN offer o ON b.buyer_id = o.buyer_id
LEFT JOIN sale s ON b.buyer_id = s.buyer_id
GROUP BY b.buyer_id, b.name, b.budget_min, b.budget_max
ORDER BY total_viewings DESC;

-- 6. Show properties with their features
SELECT 
    p.property_id,
    p.address,
    p.bedrooms,
    p.bathrooms,
    p.listing_price,
    STRING_AGG(pf.feature_name, ', ') AS features
FROM property p
LEFT JOIN property_feature pf ON p.property_id = pf.property_id
GROUP BY p.property_id, p.address, p.bedrooms, p.bathrooms, p.listing_price
ORDER BY p.listing_price DESC;

-- 7. Show properties within buyer budget ranges
SELECT 
    b.name AS buyer_name,
    b.budget_min,
    b.budget_max,
    p.address,
    p.listing_price,
    p.bedrooms,
    p.bathrooms,
    CASE 
        WHEN p.listing_price BETWEEN b.budget_min AND b.budget_max THEN 'Within Budget'
        WHEN p.listing_price < b.budget_min THEN 'Below Budget'
        ELSE 'Above Budget'
    END AS budget_status
FROM buyer b
CROSS JOIN property p
WHERE p.status = 'On Market'
    AND p.listing_price BETWEEN b.budget_min * 0.9 AND b.budget_max * 1.1
ORDER BY b.name, p.listing_price;

-- 8. Show concurrent transactions (multiple buyers viewing same property)
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    COUNT(DISTINCT v.buyer_id) AS number_of_viewers,
    COUNT(DISTINCT o.buyer_id) AS number_of_offers,
    STRING_AGG(DISTINCT b.name, ', ') AS buyers_viewed
FROM property p
LEFT JOIN viewing v ON p.property_id = v.property_id
LEFT JOIN offer o ON p.property_id = o.property_id
LEFT JOIN buyer b ON v.buyer_id = b.buyer_id
WHERE p.status IN ('On Market', 'Pending')
GROUP BY p.property_id, p.address, p.listing_price
HAVING COUNT(DISTINCT v.buyer_id) > 1
ORDER BY number_of_viewers DESC;

-- 9. Show properties by type and average price
SELECT 
    pt.type_name AS property_type,
    COUNT(p.property_id) AS total_properties,
    COUNT(CASE WHEN p.status = 'On Market' THEN 1 END) AS on_market,
    COUNT(CASE WHEN p.status = 'Sold' THEN 1 END) AS sold,
    COUNT(CASE WHEN p.status = 'Pending' THEN 1 END) AS pending,
    AVG(p.listing_price) AS avg_listing_price,
    MIN(p.listing_price) AS min_price,
    MAX(p.listing_price) AS max_price
FROM property_type pt
LEFT JOIN property p ON pt.type_id = p.property_type_id
GROUP BY pt.type_name
ORDER BY avg_listing_price DESC;

-- 10. Show sales statistics by month
SELECT 
    TO_CHAR(s.sale_date, 'YYYY-MM') AS sale_month,
    COUNT(s.sale_id) AS number_of_sales,
    SUM(s.sale_price) AS total_sales_volume,
    AVG(s.sale_price) AS avg_sale_price,
    SUM(s.commission_amount) AS total_commissions
FROM sale s
GROUP BY TO_CHAR(s.sale_date, 'YYYY-MM')
ORDER BY sale_month DESC;

-- 11. Show properties that need attention (on market for a while)
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    p.listing_date,
    CURRENT_DATE - p.listing_date AS days_on_market,
    COUNT(DISTINCT v.viewing_id) AS total_viewings,
    COUNT(DISTINCT o.offer_id) AS total_offers,
    p.status
FROM property p
LEFT JOIN viewing v ON p.property_id = v.property_id
LEFT JOIN offer o ON p.property_id = o.property_id
WHERE p.status = 'On Market'
GROUP BY p.property_id, p.address, p.listing_price, p.listing_date, p.status
HAVING CURRENT_DATE - p.listing_date > 30
ORDER BY days_on_market DESC;

-- 12. Show buyer-seller matching (buyers who could afford sold properties)
SELECT 
    b.name AS buyer_name,
    b.budget_max,
    p.address AS sold_property,
    s.sale_price,
    CASE 
        WHEN s.sale_price <= b.budget_max THEN 'Could Afford'
        ELSE 'Over Budget'
    END AS affordability
FROM buyer b
CROSS JOIN sale s
JOIN property p ON s.property_id = p.property_id
WHERE s.sale_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY b.name, s.sale_price;

-- 13. Show agent workload (number of active listings and sales)
SELECT 
    a.agent_id,
    a.name AS agent_name,
    COUNT(DISTINCT CASE WHEN p.status = 'On Market' THEN p.property_id END) AS active_listings,
    COUNT(DISTINCT CASE WHEN p.status = 'Pending' THEN p.property_id END) AS pending_listings,
    COUNT(DISTINCT CASE WHEN s.sale_date >= CURRENT_DATE - INTERVAL '30 days' THEN s.sale_id END) AS recent_sales,
    COUNT(DISTINCT v.viewing_id) AS viewings_scheduled
FROM agent a
LEFT JOIN property p ON a.agent_id = p.listing_agent_id
LEFT JOIN sale s ON a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id
LEFT JOIN viewing v ON a.agent_id = v.agent_id
GROUP BY a.agent_id, a.name
ORDER BY active_listings DESC, recent_sales DESC;

-- 14. Show property price trends (comparing listing vs sale prices)
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    s.sale_price,
    ROUND(((s.sale_price - p.listing_price) / p.listing_price * 100), 2) AS price_change_percent,
    s.sale_date
FROM property p
JOIN sale s ON p.property_id = s.property_id
ORDER BY s.sale_date DESC;

-- 15. Show most popular property features
SELECT 
    pf.feature_name,
    COUNT(DISTINCT pf.property_id) AS properties_with_feature,
    AVG(p.listing_price) AS avg_price_with_feature
FROM property_feature pf
JOIN property p ON pf.property_id = p.property_id
GROUP BY pf.feature_name
ORDER BY properties_with_feature DESC;

-- ============================================
-- CONCURRENT TRANSACTION DEMONSTRATION
-- ============================================

-- 16. Simulate multiple buyers interested in the same property
-- This demonstrates the system handling concurrent interest
SELECT 
    p.property_id,
    p.address,
    p.listing_price,
    p.status,
    COUNT(DISTINCT v.buyer_id) AS concurrent_viewers,
    COUNT(DISTINCT o.buyer_id) AS concurrent_offers,
    STRING_AGG(DISTINCT b.name, ' | ') AS interested_buyers
FROM property p
JOIN viewing v ON p.property_id = v.property_id
LEFT JOIN offer o ON p.property_id = o.property_id AND o.status = 'Pending'
JOIN buyer b ON v.buyer_id = b.buyer_id
WHERE p.status IN ('On Market', 'Pending')
GROUP BY p.property_id, p.address, p.listing_price, p.status
HAVING COUNT(DISTINCT v.buyer_id) > 1
ORDER BY concurrent_viewers DESC;

-- 17. Show active transactions by agent (demonstrating concurrent handling)
SELECT 
    a.name AS agent_name,
    COUNT(DISTINCT CASE WHEN p.status = 'On Market' THEN p.property_id END) AS active_listings,
    COUNT(DISTINCT CASE WHEN o.status = 'Pending' THEN o.offer_id END) AS pending_offers,
    COUNT(DISTINCT CASE WHEN s.closing_date IS NULL AND s.sale_date IS NOT NULL THEN s.sale_id END) AS pending_closings,
    COUNT(DISTINCT v.viewing_id) AS upcoming_viewings
FROM agent a
LEFT JOIN property p ON a.agent_id = p.listing_agent_id
LEFT JOIN offer o ON a.agent_id = o.agent_id
LEFT JOIN sale s ON a.agent_id = s.listing_agent_id OR a.agent_id = s.buying_agent_id
LEFT JOIN viewing v ON a.agent_id = v.agent_id AND v.viewing_date >= CURRENT_DATE
GROUP BY a.agent_id, a.name
HAVING COUNT(DISTINCT CASE WHEN p.status = 'On Market' THEN p.property_id END) > 0
    OR COUNT(DISTINCT CASE WHEN o.status = 'Pending' THEN o.offer_id END) > 0
ORDER BY active_listings DESC;

