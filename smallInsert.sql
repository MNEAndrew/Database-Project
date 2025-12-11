-- Small Insert Script for Real Estate Database
-- Delete all existing data
delete from offer;
delete from sale;
delete from viewing;
delete from property_feature;
delete from property;
delete from property_type;
delete from seller;
delete from buyer;
delete from agent;

-- Insert Agents
insert into agent values ('A001', 'Sarah Johnson', '555-0101', 'sarah.j@realty.com', 'LIC-12345', 3.00, '2020-01-15');
insert into agent values ('A002', 'Michael Chen', '555-0102', 'michael.c@realty.com', 'LIC-12346', 2.75, '2019-03-20');
insert into agent values ('A003', 'Emily Rodriguez', '555-0103', 'emily.r@realty.com', 'LIC-12347', 3.25, '2021-06-10');
insert into agent values ('A004', 'David Kim', '555-0104', 'david.k@realty.com', 'LIC-12348', 2.50, '2018-11-05');

-- Insert Property Types
insert into property_type values ('PT001', 'Single Family', 'Detached single-family home');
insert into property_type values ('PT002', 'Condo', 'Condominium unit');
insert into property_type values ('PT003', 'Townhouse', 'Multi-level attached home');
insert into property_type values ('PT004', 'Apartment', 'Apartment unit for rent or sale');
insert into property_type values ('PT005', 'Multi-Family', 'Duplex, triplex, or larger');

-- Insert Sellers
insert into seller values ('S001', 'Robert Williams', '555-0201', 'robert.w@email.com', '123 Oak St', 'Springfield', 'IL', '62701', '2023-01-10');
insert into seller values ('S002', 'Jennifer Martinez', '555-0202', 'jennifer.m@email.com', '456 Maple Ave', 'Springfield', 'IL', '62702', '2023-02-15');
insert into seller values ('S003', 'James Anderson', '555-0203', 'james.a@email.com', '789 Pine Rd', 'Springfield', 'IL', '62703', '2023-03-20');
insert into seller values ('S004', 'Lisa Thompson', '555-0204', 'lisa.t@email.com', '321 Elm Blvd', 'Springfield', 'IL', '62704', '2023-04-05');

-- Insert Buyers
insert into buyer values ('B001', 'John Smith', '555-0301', 'john.s@email.com', '100 Main St', 'Springfield', 'IL', '62701', 200000, 350000, 3, 2.0, '2023-05-01');
insert into buyer values ('B002', 'Maria Garcia', '555-0302', 'maria.g@email.com', '200 Center Ave', 'Springfield', 'IL', '62702', 300000, 500000, 4, 2.5, '2023-05-10');
insert into buyer values ('B003', 'Robert Lee', '555-0303', 'robert.l@email.com', '300 Park Dr', 'Springfield', 'IL', '62703', 150000, 250000, 2, 1.5, '2023-05-15');
insert into buyer values ('B004', 'Patricia Brown', '555-0304', 'patricia.b@email.com', '400 River Ln', 'Springfield', 'IL', '62704', 400000, 600000, 5, 3.0, '2023-05-20');

-- Insert Properties
insert into property values ('P001', '123 Oak Street', 'Springfield', 'IL', '62701', 'PT001', 3, 2.0, 1800, 0.25, 1995, 275000, 'On Market', '2023-06-01', 'Beautiful single-family home with updated kitchen', 'S001', 'A001');
insert into property values ('P002', '456 Maple Avenue', 'Springfield', 'IL', '62702', 'PT002', 2, 1.5, 1200, 0.10, 2010, 185000, 'On Market', '2023-06-05', 'Modern condo with great amenities', 'S002', 'A002');
insert into property values ('P003', '789 Pine Road', 'Springfield', 'IL', '62703', 'PT001', 4, 2.5, 2200, 0.35, 2005, 325000, 'Pending', '2023-05-20', 'Spacious family home with large yard', 'S003', 'A003');
insert into property values ('P004', '321 Elm Boulevard', 'Springfield', 'IL', '62704', 'PT003', 3, 2.5, 1600, 0.15, 2015, 245000, 'Sold', '2023-04-10', 'Well-maintained townhouse in great location', 'S004', 'A001');
insert into property values ('P005', '555 Cedar Lane', 'Springfield', 'IL', '62701', 'PT001', 5, 3.0, 2800, 0.50, 2018, 450000, 'On Market', '2023-06-10', 'Luxury home with premium finishes', 'S001', 'A004');

-- Insert Property Features
insert into property_feature values ('P001', 'Garage');
insert into property_feature values ('P001', 'Fireplace');
insert into property_feature values ('P002', 'Balcony');
insert into property_feature values ('P002', 'Gym Access');
insert into property_feature values ('P003', 'Garage');
insert into property_feature values ('P003', 'Pool');
insert into property_feature values ('P003', 'Fireplace');
insert into property_feature values ('P004', 'Garage');
insert into property_feature values ('P005', 'Garage');
insert into property_feature values ('P005', 'Pool');
insert into property_feature values ('P005', 'Fireplace');
insert into property_feature values ('P005', 'Home Office');

-- Insert Viewings
insert into viewing values ('V001', 'P001', 'B001', 'A001', '2023-06-05', '14:00:00', 'Buyer liked the kitchen, concerned about age', 'Y');
insert into viewing values ('V002', 'P002', 'B003', 'A002', '2023-06-06', '10:00:00', 'Perfect size for buyer, considering offer', 'Y');
insert into viewing values ('V003', 'P001', 'B002', 'A001', '2023-06-07', '15:30:00', 'Too small for needs', 'N');
insert into viewing values ('V004', 'P003', 'B002', 'A003', '2023-06-08', '11:00:00', 'Excellent property, made offer', 'Y');
insert into viewing values ('V005', 'P005', 'B004', 'A004', '2023-06-12', '13:00:00', 'Very interested, discussing financing', 'Y');

-- Insert Offers
insert into offer values ('O001', 'P003', 'B002', 'A003', 310000, '2023-06-10', '2023-06-17', 'Accepted');
insert into offer values ('O002', 'P001', 'B001', 'A001', 265000, '2023-06-08', '2023-06-15', 'Pending');
insert into offer values ('O003', 'P002', 'B003', 'A002', 180000, '2023-06-07', '2023-06-14', 'Rejected');
insert into offer values ('O004', 'P005', 'B004', 'A004', 435000, '2023-06-13', '2023-06-20', 'Pending');

-- Insert Sales (Recently Sold Properties)
insert into sale values ('SA001', 'P004', 'B001', 'S004', 'A001', 'A001', 245000, 240000, '2023-05-15', '2023-06-01', 7200);
insert into sale values ('SA002', 'P003', 'B002', 'S003', 'A003', 'A003', 325000, 310000, '2023-06-10', null, 9300);
