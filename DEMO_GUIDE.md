# Real Estate Database Demo Guide

## Overview
This database implements a real estate management system (similar to Zillow/Redfin) that tracks agents, buyers, sellers, properties, viewings, offers, and sales. The system is designed to handle concurrent transactions where multiple customers can be interested in the same properties simultaneously.

## Setup Instructions

### Step 1: Create the Database Schema
Run the DDL file to create all tables:
```sql
-- Execute this file first
\i dropddl.sql
```
Or if your database system doesn't support `\i`, execute the contents of `dropddl.sql` directly.

### Step 2: Populate with Sample Data
Choose one of the following:

**Option A: Small Dataset (for quick testing)**
```sql
\i smallInsert.sql
```

**Option B: Large Dataset (for comprehensive demo)**
```sql
\i largeInsert.sql
```

### Step 3: Run Demo Queries
Execute queries from `demo_queries.sql` to see the database in action.

## Database Structure

### Core Entities
- **Agents**: Real estate agents with license numbers and commission rates
- **Buyers**: People looking to purchase properties (with budget ranges)
- **Sellers**: People selling properties
- **Properties**: Real estate listings with details (bedrooms, bathrooms, price, status)
- **Property Types**: Categories (Single Family, Condo, Townhouse, etc.)
- **Property Features**: Additional amenities (garage, pool, fireplace, etc.)

### Transaction Entities
- **Viewings**: Records of buyers viewing properties
- **Offers**: Purchase offers with status tracking
- **Sales**: Completed property transactions

## Key Features Demonstrated

### 1. Property Listings
- Properties can be in different statuses: On Market, Pending, Sold, Off Market, Withdrawn
- Each property has detailed information (size, bedrooms, bathrooms, price)
- Properties are linked to sellers and listing agents

### 2. Buyer-Seller Matching
- Buyers have budget ranges and preferences
- System can match buyers with properties within their budget
- Tracks buyer viewing history and interests

### 3. Concurrent Transactions
- Multiple buyers can view the same property simultaneously
- Multiple offers can be pending on the same property
- System tracks all concurrent activities without conflicts

### 4. Agent Management
- Agents can be listing agents or buying agents
- Tracks agent performance (sales, commissions, active listings)
- Multiple agents can work on different properties concurrently

### 5. Sales Tracking
- Records completed sales with prices, dates, and commissions
- Tracks both listing and sale prices
- Links buyers, sellers, and agents involved in transactions

## Demo Scenarios

### Scenario 1: Property Search
**Query**: Show all properties currently on the market
- Demonstrates basic property listing functionality
- Shows property details, agent, and seller information

### Scenario 2: Sales Analysis
**Query**: Show recently sold properties with sale details
- Demonstrates transaction tracking
- Shows price differences and commission calculations

### Scenario 3: Concurrent Interest
**Query**: Show properties with multiple interested buyers
- Demonstrates system handling concurrent transactions
- Shows how multiple buyers can view and make offers on same property

### Scenario 4: Agent Performance
**Query**: Show agent performance metrics
- Demonstrates business intelligence capabilities
- Shows sales volume, commissions, and active listings per agent

### Scenario 5: Buyer Journey
**Query**: Show buyer viewing history and offers
- Demonstrates tracking buyer activities
- Shows progression from viewing to offer to purchase

## Sample Demo Flow

1. **Start with Setup**
   - Run `dropddl.sql` to create schema
   - Run `largeInsert.sql` to populate data

2. **Show Current Market**
   - Query: "Show all properties on the market"
   - Demonstrates active listings

3. **Show Buyer Activity**
   - Query: "Show buyers and their viewing history"
   - Demonstrates buyer engagement

4. **Show Concurrent Transactions**
   - Query: "Show properties with multiple interested buyers"
   - Demonstrates concurrent handling

5. **Show Sales Performance**
   - Query: "Show agent performance"
   - Demonstrates business metrics

6. **Show Recent Sales**
   - Query: "Show recently sold properties"
   - Demonstrates completed transactions

## Database Statistics (Large Dataset)

- **20 Agents**: Real estate professionals
- **40 Buyers**: People looking to purchase
- **30 Sellers**: People selling properties
- **50 Properties**: Various property types and statuses
- **100 Viewings**: Buyer property viewings
- **30 Offers**: Purchase offers in various states
- **15 Sales**: Completed transactions

## Important Notes

1. **Concurrent Transactions**: The database design supports multiple buyers viewing and making offers on the same property simultaneously. This is demonstrated through the viewing and offer tables.

2. **Data Integrity**: Foreign key constraints ensure referential integrity. Check constraints validate data ranges (prices, dates, etc.).

3. **Status Tracking**: Properties have status fields that track their lifecycle (On Market → Pending → Sold).

4. **Commission Calculation**: Sales records include commission amounts, which can be calculated based on agent commission rates and sale prices.

## Troubleshooting

### If you get foreign key errors:
- Make sure you run `dropddl.sql` first to create all tables
- Then run the insert file (smallInsert.sql or largeInsert.sql)

### If queries return no results:
- Verify that data was inserted successfully
- Check that you're using the correct table names and column names
- Some queries may need adjustment based on your database system (PostgreSQL, MySQL, Oracle, etc.)

### Database System Compatibility:
- The schema uses standard SQL
- Some functions like `STRING_AGG` may need adjustment:
  - PostgreSQL: `STRING_AGG`
  - MySQL: `GROUP_CONCAT`
  - SQL Server: `STRING_AGG` (SQL Server 2017+)
  - Oracle: `LISTAGG`

## Next Steps

1. Run the setup scripts
2. Execute demo queries from `demo_queries.sql`
3. Modify queries to explore different aspects of the database
4. Add your own queries to test specific scenarios

## Questions to Explore

- Which properties are most popular (most viewings)?
- Which agents have the best sales performance?
- What's the average time a property stays on the market?
- Which property features are most common?
- How do listing prices compare to sale prices?
- Which buyers are most active in the market?

