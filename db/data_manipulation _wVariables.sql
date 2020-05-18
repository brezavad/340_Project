-- Start add customer page queries
-- Search for customer by email
SELECT customer_id, first_name, last_name, email FROM customers WHERE email = :userEmailInput;
-- Add customer information
INSERT INTO customers (first_name, last_name, email) VALUES (:userInputFirstName, :userInputLastName, :userInputEmail);
-- Update customer information
UPDATE customers SET first_name = :userInputFirstName, last_name = userInputLastName, email = :userInputEmail WHERE customer_id = :variableFromForm;
-- End add customer page queries

-- start all customer page queries
-- Select all customers
SELECT customer_id, first_name, last_name, email FROM customers;
-- end all customer page queries

-- start order page queries
-- search for customer by email
SELECT customer_id, first_name, last_name, email FROM customers WHERE email = :userInputEmail;
-- search for store information
SELECT street_address, city, state, zipcode FROM stores WHERE store_id = :userInputFormDropdown;
-- select all computer inventory at a particular store
SELECT computer_systems.description,
       computer_systems.ram,
       computer_systems.hard_drive,
       computer_systems.screen_size,
       inventory.quantity 
       FROM computer_systems
       INNER JOIN inventory
       ON inventory.store_id = :userInputFormDropdown and inventory.computer_id = computer_systems.computer_id;
-- check that amount requested can be fullfilled
SELECT quantity FROM inventory WHERE computer_id = :userInputFormDropdown and store_id = :userInputFormDropdown;
-- add to orders table (this needs work)
SET @c_id = (SELECT customer_id FROM customers WHERE email = :userInputEmail);
SET @i_id = (SELECT inventory_id FROM inventory WHERE computer_id = :userInputFormDropdown and store_id = :userInputFormDropdown);
INSERT INTO orders (customer_id, inventory_id, quantity) VALUES (
    @c_id,
    @i_id,
    :userInputQuantity
);
-- update inventory after order has been placed
UPDATE inventory SET quantity = :userInputQuantity WHERE computer_id = :userInputFormDropdown and store_id = :userInputFormDropdown;
-- end order page queries

-- start all orders page queries
-- fill orders table
SELECT orders.order_id,
       orders.customer_id,
       orders.inventory_id,
       inventory.computer_id,
       orders.quantity,
       customers.first_name,
       customers.last_name,
       computer_systems.description
       FROM orders
       INNER JOIN customers
       INNER JOIN inventory
       INNER JOIN computer_systems
       ON orders.customer_id = customers.customer_id
       and orders.inventory_id = inventory.inventory_id
       and inventory.computer_id = computer_systems.computer_id;
-- end all orders page queries

-- start stores page queries
-- insert new stores
INSERT INTO stores (street_address, city, state, zipcode) VALUES (:userInputStreet, :userInputCity, :userInputState, :userInputZip);
-- Select all stores
SELECT street_address, city, state, zipcode FROM stores;
-- end stores page queries

-- start inventory page queries
-- add new inventory
INSERT INTO computer_systems (description, ram, hard_drive, screen_size) VALUES (:userInputDescr, :userInputRam, :userInputDrive, :userInputScreen);
SET @c_id = (SELECT computer_id 
             FROM computer_systems 
             WHERE description = :userInputDescr 
             and ram = :userInputRam
             and hard_drive = :userInputDrive
             and screen_size = :userInputScreen);
INSERT INTO inventory (computer_id, store_id, quantity) VALUES (@c_id, :userInputStore, :userInputQuantity);
-- select all inventory information
SELECT inventory.store_id,
       inventory.computer_id,
       computer_systems.description,
       computer_systems.ram,
       computer_systems.screen_size,
       inventory.quantity
       FROM inventory
       INNER JOIN computer_systems
       ON inventory.computer_id = computer_systems.computer_id;
-- end inventory page queries

