-- create customers table
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    customer_id int AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL
);

-- insert mock data into customers table
INSERT INTO customers (first_name, last_name, email)
VALUES('Rebecca', 'Johnson', 'rjonhson@gmail.com'),
('John', 'Williams', 'johnwilliams@gmail.com'),
('Emma', 'Wilson', 'ewilson@gmail.com');

-- create stores table
DROP TABLE IF EXISTS stores;
CREATE TABLE stores (
    store_id int AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(256) NOT NULL,
    city VARCHAR(256) NOT NULL,
    state CHAR(2) NOT NULL,
    zipcode CHAR(5) NOT NULL
);

-- create mock data into stores table
INSERT INTO stores (street_address, city, state, zipcode)
VALUES ('1 Broad Street', 'New York City', 'NY', '10065'),
('26 Main Street', 'Providence', 'RI', '02860'),
('5 Central Avenue', 'San Francisco', 'CA', '94016');

-- create computer systems table
DROP TABLE IF EXISTS computer_systems;
CREATE TABLE computer_systems (
    computer_id int AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(256) NOT NULL,
    ram int NOT NULL,
    hard_drive int NOT NULL,
    screen_size int NOT NULL
);

-- insert into mock data into computer_systems table
INSERT INTO computer_systems (description, ram, hard_drive, screen_size)
VALUES ('New computer designed for personal use.', 8, 128, 16),
('Refurbished computer originally designed for office use.', 16, 256, 20),
('Used computer designed for portability.', 4, 128, 12);

-- create inventory table
DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
    inventory_id int AUTO_INCREMENT PRIMARY KEY,
    computer_id int NOT NULL,
    store_id int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY(computer_id) REFERENCES computer_systems(computer_id),
    FOREIGN KEY(store_id) REFERENCES stores(store_id)
);

-- insert mock data into inventory table
INSERT INTO inventory (computer_id, store_id, quantity)
VALUES (3, 1, 10),
(1, 2, 20),
(2, 3, 30);

-- create orders table
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id int AUTO_INCREMENT PRIMARY KEY,
    customer_id int,
    inventory_id int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY(inventory_id) REFERENCES inventory(inventory_id)
);

-- insert mock data into orders table
INSERT INTO orders (customer_id, inventory_id, quantity)
VALUES (1, 3, 5),
(2, 2, 3),
(3, 1, 10);

