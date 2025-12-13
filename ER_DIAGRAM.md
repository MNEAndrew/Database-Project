# Entity-Relationship (ER) Diagram
## Real Estate Database

### Diagram Description

This document describes the Entity-Relationship model for the Real Estate Database system, similar to Zillow/Redfin.

---

## Entities

### 1. AGENT
**Description**: Real estate agents who facilitate property transactions

**Attributes**:
- `agent_id` (PK, VARCHAR2(10)) - Unique identifier
- `name` (VARCHAR2(50), NOT NULL) - Agent's full name
- `phone` (VARCHAR2(15)) - Contact phone number
- `email` (VARCHAR2(100)) - Contact email
- `license_number` (VARCHAR2(20), UNIQUE, NOT NULL) - Real estate license number
- `commission_rate` (NUMBER(5,2)) - Commission rate percentage (0-100)
- `hire_date` (DATE) - Date agent was hired

**Relationships**:
- Lists properties (1:N with PROPERTY)
- Facilitates viewings (1:N with VIEWING)
- Represents buyers in offers (1:N with OFFER)
- Acts as listing agent in sales (1:N with SALE)
- Acts as buying agent in sales (1:N with SALE)

---

### 2. BUYER
**Description**: People looking to purchase properties

**Attributes**:
- `buyer_id` (PK, VARCHAR2(10)) - Unique identifier
- `name` (VARCHAR2(50), NOT NULL) - Buyer's full name
- `phone` (VARCHAR2(15)) - Contact phone number
- `email` (VARCHAR2(100)) - Contact email
- `address` (VARCHAR2(200)) - Street address
- `city` (VARCHAR2(50)) - City
- `state` (VARCHAR2(2)) - State code
- `zip_code` (VARCHAR2(10)) - ZIP code
- `budget_min` (NUMBER(12,2)) - Minimum budget
- `budget_max` (NUMBER(12,2)) - Maximum budget
- `preferred_bedrooms` (NUMBER(2,0)) - Preferred number of bedrooms
- `preferred_bathrooms` (NUMBER(3,1)) - Preferred number of bathrooms
- `registration_date` (DATE) - Account registration date

**Relationships**:
- Views properties (1:N with VIEWING)
- Makes offers (1:N with OFFER)
- Purchases properties (1:N with SALE)

---

### 3. SELLER
**Description**: People selling properties

**Attributes**:
- `seller_id` (PK, VARCHAR2(10)) - Unique identifier
- `name` (VARCHAR2(50), NOT NULL) - Seller's full name
- `phone` (VARCHAR2(15)) - Contact phone number
- `email` (VARCHAR2(100)) - Contact email
- `address` (VARCHAR2(200)) - Street address
- `city` (VARCHAR2(50)) - City
- `state` (VARCHAR2(2)) - State code
- `zip_code` (VARCHAR2(10)) - ZIP code
- `registration_date` (DATE) - Account registration date

**Relationships**:
- Owns properties (1:N with PROPERTY)
- Sells properties (1:N with SALE)

---

### 4. PROPERTY_TYPE
**Description**: Lookup table for property types

**Attributes**:
- `type_id` (PK, VARCHAR2(10)) - Unique identifier
- `type_name` (VARCHAR2(50), NOT NULL) - Type name (e.g., Single Family, Condo)
- `description` (VARCHAR2(200)) - Description of property type

**Relationships**:
- Categorizes properties (1:N with PROPERTY)

---

### 5. PROPERTY
**Description**: Real estate listings

**Attributes**:
- `property_id` (PK, VARCHAR2(10)) - Unique identifier
- `address` (VARCHAR2(200), NOT NULL) - Street address
- `city` (VARCHAR2(50), NOT NULL) - City
- `state` (VARCHAR2(2), NOT NULL) - State code
- `zip_code` (VARCHAR2(10), NOT NULL) - ZIP code
- `property_type_id` (FK, VARCHAR2(10)) - References PROPERTY_TYPE
- `bedrooms` (NUMBER(2,0)) - Number of bedrooms
- `bathrooms` (NUMBER(3,1)) - Number of bathrooms
- `square_feet` (NUMBER(8,0)) - Square footage
- `lot_size` (NUMBER(10,2)) - Lot size in acres
- `year_built` (NUMBER(4,0)) - Year property was built
- `listing_price` (NUMBER(12,2)) - Listing price
- `status` (VARCHAR2(20)) - Status: On Market, Pending, Sold, Off Market, Withdrawn
- `listing_date` (DATE) - Date listed
- `description` (CLOB) - Property description
- `seller_id` (FK, VARCHAR2(10)) - References SELLER
- `listing_agent_id` (FK, VARCHAR2(10)) - References AGENT

**Relationships**:
- Has type (N:1 with PROPERTY_TYPE)
- Owned by seller (N:1 with SELLER)
- Listed by agent (N:1 with AGENT)
- Has features (1:N with PROPERTY_FEATURE)
- Viewed by buyers (1:N with VIEWING)
- Receives offers (1:N with OFFER)
- Sold in transactions (1:1 with SALE)

---

### 6. PROPERTY_FEATURE
**Description**: Additional features/amenities of properties

**Attributes**:
- `property_id` (PK, FK, VARCHAR2(10)) - References PROPERTY
- `feature_name` (PK, VARCHAR2(50)) - Feature name (e.g., Garage, Pool, Fireplace)

**Relationships**:
- Belongs to property (N:1 with PROPERTY)

---

### 7. VIEWING
**Description**: Records of buyers viewing properties

**Attributes**:
- `viewing_id` (PK, VARCHAR2(10)) - Unique identifier
- `property_id` (FK, VARCHAR2(10), NOT NULL) - References PROPERTY
- `buyer_id` (FK, VARCHAR2(10), NOT NULL) - References BUYER
- `agent_id` (FK, VARCHAR2(10)) - References AGENT (facilitating agent)
- `viewing_date` (DATE, NOT NULL) - Date of viewing
- `viewing_time` (TIMESTAMP) - Time of viewing
- `notes` (CLOB) - Viewing notes
- `interested` (CHAR(1)) - Y or N

**Relationships**:
- Views property (N:1 with PROPERTY)
- Viewed by buyer (N:1 with BUYER)
- Facilitated by agent (N:1 with AGENT)

---

### 8. OFFER
**Description**: Purchase offers made by buyers

**Attributes**:
- `offer_id` (PK, VARCHAR2(10)) - Unique identifier
- `property_id` (FK, VARCHAR2(10), NOT NULL) - References PROPERTY
- `buyer_id` (FK, VARCHAR2(10), NOT NULL) - References BUYER
- `agent_id` (FK, VARCHAR2(10)) - References AGENT (representing buyer)
- `offer_amount` (NUMBER(12,2)) - Offer amount
- `offer_date` (DATE, NOT NULL) - Date offer made
- `expiration_date` (DATE) - Offer expiration date
- `status` (VARCHAR2(20)) - Pending, Accepted, Rejected, Withdrawn, Expired
- `conditions` (CLOB) - Offer conditions

**Relationships**:
- Made on property (N:1 with PROPERTY)
- Made by buyer (N:1 with BUYER)
- Represented by agent (N:1 with AGENT)

---

### 9. SALE
**Description**: Completed property transactions

**Attributes**:
- `sale_id` (PK, VARCHAR2(10)) - Unique identifier
- `property_id` (FK, VARCHAR2(10), NOT NULL) - References PROPERTY
- `buyer_id` (FK, VARCHAR2(10), NOT NULL) - References BUYER
- `seller_id` (FK, VARCHAR2(10), NOT NULL) - References SELLER
- `listing_agent_id` (FK, VARCHAR2(10)) - References AGENT (listing agent)
- `buying_agent_id` (FK, VARCHAR2(10)) - References AGENT (buyer's agent)
- `listing_price` (NUMBER(12,2)) - Original listing price
- `sale_price` (NUMBER(12,2)) - Final sale price
- `sale_date` (DATE, NOT NULL) - Date of sale
- `closing_date` (DATE) - Closing date
- `commission_amount` (NUMBER(12,2)) - Commission amount

**Relationships**:
- Sale of property (1:1 with PROPERTY)
- Purchased by buyer (N:1 with BUYER)
- Sold by seller (N:1 with SELLER)
- Listing agent (N:1 with AGENT)
- Buying agent (N:1 with AGENT)

---

## Relationships Summary

1. **AGENT** ↔ **PROPERTY**: One agent can list many properties (1:N)
2. **AGENT** ↔ **VIEWING**: One agent can facilitate many viewings (1:N)
3. **AGENT** ↔ **OFFER**: One agent can represent buyers in many offers (1:N)
4. **AGENT** ↔ **SALE**: One agent can be listing agent or buying agent in many sales (1:N)
5. **BUYER** ↔ **VIEWING**: One buyer can view many properties (1:N)
6. **BUYER** ↔ **OFFER**: One buyer can make many offers (1:N)
7. **BUYER** ↔ **SALE**: One buyer can purchase many properties (1:N)
8. **SELLER** ↔ **PROPERTY**: One seller can own many properties (1:N)
9. **SELLER** ↔ **SALE**: One seller can sell many properties (1:N)
10. **PROPERTY_TYPE** ↔ **PROPERTY**: One type can categorize many properties (1:N)
11. **PROPERTY** ↔ **PROPERTY_FEATURE**: One property can have many features (1:N)
12. **PROPERTY** ↔ **VIEWING**: One property can be viewed many times (1:N)
13. **PROPERTY** ↔ **OFFER**: One property can receive many offers (1:N)
14. **PROPERTY** ↔ **SALE**: One property can have one sale (1:1)

---

## ER Diagram Visual Representation

```
┌─────────────┐
│   AGENT     │
├─────────────┤
│ agent_id PK │
│ name        │
│ phone       │
│ email       │
│ license_#   │
│ commission  │
│ hire_date   │
└──────┬──────┘
       │
       │ 1
       │
       │ N
┌──────▼──────────┐      ┌──────────────┐
│   PROPERTY      │      │ PROPERTY_TYPE│
├─────────────────┤      ├──────────────┤
│ property_id PK  │      │ type_id PK   │
│ address         │      │ type_name    │
│ city            │      │ description  │
│ state           │      └──────┬───────┘
│ zip_code        │            │
│ property_type_id│◄───────────┘ N:1
│ bedrooms        │
│ bathrooms       │
│ square_feet     │
│ lot_size        │
│ year_built      │
│ listing_price   │
│ status          │
│ listing_date    │
│ description     │
│ seller_id FK    │
│ listing_agent_id│
└──────┬──────────┘
       │
       │ 1
       │
       │ N
┌──────▼──────────────┐
│ PROPERTY_FEATURE    │
├─────────────────────┤
│ property_id PK/FK   │
│ feature_name PK     │
└─────────────────────┘

┌─────────────┐
│   SELLER    │      ┌─────────────┐
├─────────────┤      │    BUYER    │
│ seller_id PK│      ├─────────────┤
│ name        │      │ buyer_id PK │
│ phone       │      │ name        │
│ email       │      │ phone       │
│ address     │      │ email       │
│ city        │      │ address     │
│ state       │      │ city        │
│ zip_code    │      │ state       │
│ reg_date    │      │ zip_code    │
└──────┬──────┘      │ budget_min  │
       │             │ budget_max  │
       │ 1           │ pref_beds   │
       │             │ pref_baths  │
       │ N           │ reg_date    │
┌──────▼──────────┐  └──────┬──────┘
│   PROPERTY      │         │
│ (see above)     │         │ 1
└──────┬──────────┘         │
       │                    │ N
       │ 1                  │
       │                    │
       │ N        ┌─────────▼──────────┐
┌──────▼──────────▼──────────┐        │
│        VIEWING              │        │
├─────────────────────────────┤        │
│ viewing_id PK               │        │
│ property_id FK              │        │
│ buyer_id FK                 │        │
│ agent_id FK                 │        │
│ viewing_date                │        │
│ viewing_time                │        │
│ notes                       │        │
│ interested                  │        │
└─────────────────────────────┘        │
                                       │
┌──────────────────────────────────────▼──────────┐
│                    OFFER                        │
├─────────────────────────────────────────────────┤
│ offer_id PK                                     │
│ property_id FK                                  │
│ buyer_id FK                                     │
│ agent_id FK                                     │
│ offer_amount                                   │
│ offer_date                                     │
│ expiration_date                                │
│ status                                         │
│ conditions                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                      SALE                       │
├─────────────────────────────────────────────────┤
│ sale_id PK                                      │
│ property_id FK                                  │
│ buyer_id FK                                     │
│ seller_id FK                                    │
│ listing_agent_id FK                             │
│ buying_agent_id FK                              │
│ listing_price                                   │
│ sale_price                                      │
│ sale_date                                      │
│ closing_date                                    │
│ commission_amount                               │
└─────────────────────────────────────────────────┘
```

---

## Key Constraints

1. **Primary Keys**: Each entity has a unique primary key
2. **Foreign Keys**: All relationships are enforced with foreign key constraints
3. **Check Constraints**: 
   - Commission rate: 0-100
   - Budget max >= budget min
   - Square feet > 0
   - Listing price > 0
   - Status values are restricted
   - Closing date >= sale date
4. **Unique Constraints**: License numbers must be unique
5. **Cascade Deletes**: Property features, viewings, offers, and sales cascade when property is deleted
6. **Set Null on Delete**: Agent and seller references set to null when deleted (preserves property records)

---

## Notes

- The database supports concurrent transactions (multiple buyers viewing/making offers on same property)
- Property status tracks the lifecycle: On Market → Pending → Sold
- Agents can represent both sellers (listing) and buyers (purchasing)
- Property features are stored as a many-to-many relationship (one property can have many features)
- The system tracks complete transaction history from viewing to offer to sale

