# Real Estate Database Project

CSE 4701 Database Project - Option 5: Real Estate Database (similar to Zillow/Redfin)

## Project Overview

This project implements a comprehensive real estate management database system that tracks agents, buyers, sellers, properties, viewings, offers, and sales. The database is designed to handle concurrent transactions where multiple customers can be interested in the same properties simultaneously.

## Database Schema

The database includes the following entities:

- **Agents**: Real estate professionals with license numbers and commission rates
- **Buyers**: People looking to purchase properties (with budget ranges and preferences)
- **Sellers**: People selling properties
- **Properties**: Real estate listings with detailed information
- **Property Types**: Categories (Single Family, Condo, Townhouse, etc.)
- **Property Features**: Additional amenities (garage, pool, fireplace, etc.)
- **Viewings**: Records of buyers viewing properties
- **Offers**: Purchase offers with status tracking
- **Sales**: Completed property transactions

## Files

- **`ddl.sql`** - Complete database schema with all table definitions
- **`dropddl.sql`** - Drop statements and schema recreation
- **`smallInsert.sql`** - Small sample dataset (4 agents, 4 buyers, 4 sellers, 5 properties)
- **`largeInsert.sql`** - Large sample dataset (20 agents, 40 buyers, 30 sellers, 50 properties, 100 viewings, 30 offers, 15 sales)
- **`demo_queries.sql`** - Comprehensive demo queries (17 queries)
- **`quick_demo.sql`** - Quick demo queries (10 essential queries)
- **`DEMO_GUIDE.md`** - Detailed demo guide and documentation

## Quick Start

### 1. Create the Database Schema
```sql
-- Execute dropddl.sql to create all tables
\i dropddl.sql
```

### 2. Populate with Sample Data
```sql
-- Option A: Small dataset (quick testing)
\i smallInsert.sql

-- Option B: Large dataset (comprehensive demo)
\i largeInsert.sql
```

### 3. Run Demo Queries
```sql
-- Quick demo
\i quick_demo.sql

-- Or comprehensive demo
\i demo_queries.sql
```

## Key Features

- **Property Listings**: Track properties with various statuses (On Market, Pending, Sold, etc.)
- **Buyer-Seller Matching**: Match buyers with properties within their budget
- **Concurrent Transactions**: Handle multiple buyers viewing/making offers on the same property
- **Agent Management**: Track agent performance, sales, and commissions
- **Sales Tracking**: Record completed sales with prices, dates, and commissions
- **Viewing History**: Track buyer property viewings and interests
- **Offer Management**: Track purchase offers with status (Pending, Accepted, Rejected, etc.)

## Sample Data Statistics (Large Dataset)

- **20 Agents**: Real estate professionals
- **40 Buyers**: People looking to purchase
- **30 Sellers**: People selling properties
- **50 Properties**: Various property types and statuses
- **100 Viewings**: Buyer property viewings
- **30 Offers**: Purchase offers in various states
- **15 Sales**: Completed transactions

## Example Queries

### View Properties on the Market
```sql
SELECT p.address, p.listing_price, p.status, a.name AS agent
FROM property p
LEFT JOIN agent a ON p.listing_agent_id = a.agent_id
WHERE p.status = 'On Market';
```

### Show Concurrent Transactions
```sql
SELECT p.address, COUNT(DISTINCT v.buyer_id) AS concurrent_viewers
FROM property p
JOIN viewing v ON p.property_id = v.property_id
GROUP BY p.property_id, p.address
HAVING COUNT(DISTINCT v.buyer_id) > 1;
```

### Agent Performance
```sql
SELECT a.name, COUNT(s.sale_id) AS sales, SUM(s.commission_amount) AS commissions
FROM agent a
LEFT JOIN sale s ON a.agent_id = s.listing_agent_id
GROUP BY a.agent_id, a.name;
```

## Documentation

See `DEMO_GUIDE.md` for detailed documentation, setup instructions, and demo scenarios.

## Database Compatibility

The schema uses standard SQL and should work with:
- PostgreSQL
- MySQL
- SQL Server
- Oracle

Note: Some aggregate functions (like `STRING_AGG`) may need adjustment based on your database system.

## Project Requirements

This project fulfills the requirements for CSE 4701 Database Systems course, specifically:
- Option 5: Real Estate Database (e.g., Zillow, Redfin)
- Tracks agents, buyers, sellers, properties on the market, and recently sold properties
- Handles concurrent transactions (multiple customers buying goods at the same time)

## Author

Database Project - CSE 4701

## License

This project is for educational purposes.
