-- create customers table
CREATE TABLE customers (
    customer_id int AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL
);

-- create stores table
CREATE TABLE stores (
    store_id int AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(256) NOT NULL,
    city VARCHAR(256) NOT NULL,
    state CHAR(2) NOT NULL,
    zipcode CHAR(5) NOT NULL
);

-- create computer systems table
CREATE TABLE computer_systems (
    computer_id int AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(256) NOT NULL,
    ram int NOT NULL,
    hard_drive int NOT NULL,
    screen_size int NOT NULL
);

-- create inventory table
CREATE TABLE inventory (
    inventory_id int AUTO_INCREMENT PRIMARY KEY,
    computer_id int NOT NULL,
    store_id int NOT NULL,
    FOREIGN KEY(computer_id) REFERENCES computer_systems(computer_id),
    FOREIGN KEY(store_id) REFERENCES stores(store_id)
);

-- create orders table
CREATE TABLE orders (
    order_id int AUTO_INCREMENT PRIMARY KEY,
    customer_id int,
    inventory_id int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY(inventory_id) REFERENCES inventory(inventory_id)
);

