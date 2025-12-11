-- Real Estate Database Schema
-- CSE 4701 Project - Option 5: Real Estate Database (e.g., Zillow, Redfin)

-- Agents table: Real estate agents who facilitate transactions
create table agent
	(agent_id		varchar(10),
	 name			varchar(50) not null,
	 phone			varchar(15),
	 email			varchar(100),
	 license_number		varchar(20) not null unique,
	 commission_rate	numeric(5,2) check (commission_rate >= 0 and commission_rate <= 100),
	 hire_date		date,
	 primary key (agent_id)
	);

-- Buyers table: People looking to purchase properties
create table buyer
	(buyer_id		varchar(10),
	 name			varchar(50) not null,
	 phone			varchar(15),
	 email			varchar(100),
	 address		varchar(200),
	 city			varchar(50),
	 state			varchar(2),
	 zip_code		varchar(10),
	 budget_min		numeric(12,2) check (budget_min >= 0),
	 budget_max		numeric(12,2) check (budget_max >= 0),
	 preferred_bedrooms	numeric(2,0) check (preferred_bedrooms >= 0),
	 preferred_bathrooms	numeric(3,1) check (preferred_bathrooms >= 0),
	 registration_date	date,
	 primary key (buyer_id),
	 check (budget_max >= budget_min)
	);

-- Sellers table: People selling properties
create table seller
	(seller_id		varchar(10),
	 name			varchar(50) not null,
	 phone			varchar(15),
	 email			varchar(100),
	 address		varchar(200),
	 city			varchar(50),
	 state			varchar(2),
	 zip_code		varchar(10),
	 registration_date	date,
	 primary key (seller_id)
	);

-- Property types lookup table
create table property_type
	(type_id		varchar(10),
	 type_name		varchar(50) not null,
	 description		varchar(200),
	 primary key (type_id)
	);

-- Properties table: Real estate listings
create table property
	(property_id		varchar(10),
	 address			varchar(200) not null,
	 city				varchar(50) not null,
	 state				varchar(2) not null,
	 zip_code			varchar(10) not null,
	 property_type_id		varchar(10),
	 bedrooms			numeric(2,0) check (bedrooms >= 0),
	 bathrooms			numeric(3,1) check (bathrooms >= 0),
	 square_feet			numeric(8,0) check (square_feet > 0),
	 lot_size			numeric(10,2) check (lot_size >= 0),
	 year_built			numeric(4,0) check (year_built > 1800 and year_built <= extract(year from current_date)),
	 listing_price			numeric(12,2) check (listing_price > 0),
	 status				varchar(20) check (status in ('On Market', 'Pending', 'Sold', 'Off Market', 'Withdrawn')),
	 listing_date			date,
	 description			text,
	 seller_id			varchar(10),
	 listing_agent_id		varchar(10),
	 primary key (property_id),
	 foreign key (property_type_id) references property_type
		on delete set null,
	 foreign key (seller_id) references seller
		on delete set null,
	 foreign key (listing_agent_id) references agent
		on delete set null
	);

-- Property features table: Additional features of properties
create table property_feature
	(property_id		varchar(10),
	 feature_name		varchar(50),
	 primary key (property_id, feature_name),
	 foreign key (property_id) references property
		on delete cascade
	);

-- Viewings table: Records of buyers viewing properties
create table viewing
	(viewing_id		varchar(10),
	 property_id		varchar(10) not null,
	 buyer_id		varchar(10) not null,
	 agent_id		varchar(10),
	 viewing_date		date not null,
	 viewing_time		time,
	 notes			text,
	 interested		char(1) check (interested in ('Y', 'N')),
	 primary key (viewing_id),
	 foreign key (property_id) references property
		on delete cascade,
	 foreign key (buyer_id) references buyer
		on delete cascade,
	 foreign key (agent_id) references agent
		on delete set null
	);

-- Sales table: Completed property transactions
create table sale
	(sale_id		varchar(10),
	 property_id		varchar(10) not null,
	 buyer_id		varchar(10) not null,
	 seller_id		varchar(10) not null,
	 listing_agent_id	varchar(10),
	 buying_agent_id	varchar(10),
	 listing_price		numeric(12,2) check (listing_price > 0),
	 sale_price		numeric(12,2) check (sale_price > 0),
	 sale_date		date not null,
	 closing_date		date,
	 commission_amount	numeric(12,2) check (commission_amount >= 0),
	 primary key (sale_id),
	 foreign key (property_id) references property
		on delete cascade,
	 foreign key (buyer_id) references buyer
		on delete cascade,
	 foreign key (seller_id) references seller
		on delete cascade,
	 foreign key (listing_agent_id) references agent
		on delete set null,
	 foreign key (buying_agent_id) references agent
		on delete set null,
	 check (closing_date is null or closing_date >= sale_date)
	);

-- Offers table: Purchase offers made by buyers
create table offer
	(offer_id		varchar(10),
	 property_id		varchar(10) not null,
	 buyer_id		varchar(10) not null,
	 agent_id		varchar(10),
	 offer_amount		numeric(12,2) check (offer_amount > 0),
	 offer_date		date not null,
	 expiration_date	date,
	 status			varchar(20) check (status in ('Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Expired')),
	 conditions		text,
	 primary key (offer_id),
	 foreign key (property_id) references property
		on delete cascade,
	 foreign key (buyer_id) references buyer
		on delete cascade,
	 foreign key (agent_id) references agent
		on delete set null,
	 check (expiration_date is null or expiration_date >= offer_date)
	);
