var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});
var request = require('request');
const db = require('./db/dbConfig');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 33133);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect(function (err) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Connected to database');
});

function getCustomers(res, db, context, complete) {
  db.query(
    'SELECT customer_id, first_name, last_name, email FROM customers',
    function (error, results) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.customers = results;

      complete();
    }
  );
}

function getStores(res, db, context, complete) {
  db.query(
    `SELECT store_id, street_address, city, state, zipcode FROM stores`,
    function (error, results) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stores = results;

      complete();
    }
  );
}

function getInventory(res, db, context, complete) {
  db.query(
    `SELECT s.store_id, s.street_address, cs.computer_id, cs.description, inv.inventory_id, inv.quantity 
    FROM computer_systems cs 
    INNER JOIN inventory inv ON cs.computer_id = inv.computer_id 
    INNER JOIN stores s ON s.store_id = inv.store_id
    ORDER BY s.store_id`,
    function (error, results) {
      if (error) {
        res.write(JSON.stringify(error));
      }
      console.log(results);

      context.inventory = results;

      complete();
    }
  );
}

function getOrders(res, db, context, complete) {
  db.query(
    // `SELECT o.order_id, cu.first_name, cu.last_name, cu.email, co.computer_id, o.quantity, s.store_id FROM orders o 
    // INNER JOIN customers cu ON cu.customer_id = o.customer_id
    // INNER JOIN inventory i ON i.inventory_id = o.inventory_id
    // INNER JOIN stores s on s.store_id = i.store_id
    // INNER JOIN computer_systems co ON co.computer_id = i.computer_id
    // ORDER BY o.order_id`,
    `SELECT order_id, customer_id, inventory_id, quantity FROM orders ORDER BY order_id`,
    function (error, results) {
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }

      context.orders = results;
      complete();
    }
  );
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/addcustomers', function (req, res) {
  let context = {}
  let scripts = ['js/addCustomers.js', 'js/payloadBuilder.js', 'js/ajax.js'];

  context.scripts = scripts;

  res.render('addcustomers', context);
});

var processAddCustomersRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "add") {
      sqlString = "INSERT INTO customers " +
      "(first_name, last_name, email) " +
      "VALUES (?, ?, ?)";
      values = [data.firstName, data.lastName, data.email];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error adding customer info to customers.");
            return;
          }

          resolve("Customer added succesfully.");
        }
      );
    }
    else if (type == "search") {
      sqlString = "SELECT customer_id, first_name, last_name, email " +
        "FROM customers WHERE email = ?";
      values = [data.email];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            console.log(err);
            reject("Error searching customer info in customers.");
            return;
          }

          resolve(result);
        }
      );
    }
    else if (type == "update") {
      sqlString = "UPDATE customers " +
        "SET first_name = ?, last_name = ?, email = ? " +
        "WHERE customer_id = ?";
      values = [data.firstName, data.lastName, data.email, data.customerId];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            console.log(err);
            reject("Error updating customer info in customers.");
            return;
          }

          resolve("Customer information has been updated.");
        }
      );
    }
  })
}

app.post('/addcustomers', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processAddCustomersRequest(type, data)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/allcustomers', function (req, res) {
  let context = {};
  let scripts = ['js/allCustomers.js', 'js/payloadBuilder.js', 'js/ajax.js'];
  context.scripts = scripts;
  let callBackCount = 0;

  getCustomers(res, db, context, complete);

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('allcustomers', context);
    }
  }
});

var processAllCustomersRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "delete") {
      sqlString = "DELETE FROM customers " +
      "WHERE customer_id = ?";
      values = [data.customerId];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error deleting customer info to customers.");
            return;
          }

          resolve("Customer deleted succesfully.");
        }
      );
    }
    else {
      reject("No processing type given for all customers page.");
    }
  })
}

app.post('/allcustomers', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processAllCustomersRequest(type, data)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

var getStoreIdList = function() {
  return new Promise((resolve, reject) => {
    let sqlString = "SELECT store_id, street_address, city, state, zipcode FROM stores";

    db.query(
      sqlString,
      function(err, result) {
        if (err) {
          reject("Error getting store id list from stores.");
          return;
        }

        resolve(result);
      }
    );
  })
}

app.get('/order', function (req, res) {
  context = {};
  let scripts = ['js/order.js', 'js/payloadBuilder.js', 'js/ajax.js'];

  context.scripts = scripts;
  
  getStoreIdList()
    .then((data) => {
      context.stores = data;
      res.render('order', context);
    })
    .catch((error) => {
      console.log(error);
      res.render('order');
    });
});

var updateInventory = function(inventory, quant) {
  return new Promise((resolve, reject) => {
    let sqlString = "SELECT quantity FROM inventory WHERE inventory_id = ?";
    values = [inventory];

    db.query(
      sqlString,
      values,
      function(err, result) {
        if (err) {
          reject("Inventory failed to update (could not get quantity).");
          return;
        }

        let newQuant = parseInt(result[0].quantity) - quant;

        sqlString = "UPDATE inventory " +
          "SET quantity = ? " +
          "WHERE inventory_id = ?"
        values = [newQuant, inventory];

        db.query(
          sqlString,
          values,
          function(err, result) {
            if (err) {
              reject("Inventory failed to update (could not set quantity).");
              return;
            }

            resolve("Inventory updated successfully.");
          }
        );
      }
    );
  })
}

// var getOrderCustomer = function(data) {
//   return new Promise((resolve, reject) => {
//     sqlString = "SELECT customer_id FROM customers WHERE email = ?";
//     values = [data.email];

//     db.query(
//       sqlString,
//       values,
//       function(err, result) {
//         if (err) {
//           reject("Could not get customer id for order.");
//           return;
//         }

//         customerId = result[0].customer_id;
//         resolve(customerId);
//       }
//     );
//   });
// }

var processOrderRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "store") {
      sqlString = "SELECT computer_systems.computer_id, " +
        "computer_systems.description, " + 
        "computer_systems.ram, " +
        "computer_systems.hard_drive, " +
        "computer_systems.screen_size, " +
        "inventory.quantity " +
        "FROM computer_systems " +
        "INNER JOIN inventory " +
        "ON inventory.store_id = " + data.store + " and inventory.computer_id = computer_systems.computer_id";

      db.query(
        sqlString,
        function(err, result) {
          if (err) {
            reject("Error getting computer information for orders page.");
            return;
          }

          resolve(result);
        }
      );
    }
    else if (type == "order") {
      sqlString = "SELECT customer_id FROM customers WHERE email = ?";
      values = [data.email];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Could not get customer id for order. Order not placed.");
            return;
          }

          customer = result[0].customer_id;
          sqlString = "Select inventory_id FROM inventory WHERE store_id = ? AND computer_id = ?";
          values = [data.store, data.computer];

          db.query(
            sqlString,
            values,
            function(err, result) {
              if (err) {
                reject("Could not get inventory id for order. Order not placed.");
                return;
              }

              inventory = result[0].inventory_id;
              quant = parseInt(data.quantity);
              sqlString = "INSERT INTO orders (customer_id, inventory_id, quantity) VALUES (?, ?, ?)";
              values = [customer, inventory, quant];

              db.query(
                sqlString,
                values,
                function(err, result) {
                  if (err) {
                    console.log(err);
                    reject("Could not insert order into orders. Order not placed.");
                    return;
                  }

                  updateInventory(inventory, quant)
                  .then((data) => {
                    resolve("Order has been placed. " + data);
                  })
                  .catch((error) => {
                    reject("Order has been placed. " + error);
                  });
                }
              );
            }
          );
        }
      );
    }
  })
}

app.post('/order', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processOrderRequest(type, data)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/allorders', function (req, res) {
  let context = {};
  let callBackCount = 0;

  getOrders(res, db, context, complete);

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
       res.render('allorders', context);
    }
  }
});

app.get('/inventory', function (req, res) {
  let context = {};
  let scripts = ['js/inventory.js', 'js/payloadBuilder.js', 'js/ajax.js'];
  let callBackCount = 0;

  getInventory(res, db, context, complete);

  context.scripts = scripts;

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('inventory', context);
    }
  }
});

var processInventoryRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "add") { 
      sqlString = "INSERT INTO inventory " +
      "(computer_id, store_id, quantity) " +
      "VALUES (?, ?, ?)";
      values = [data.computer_id, data.store_id, data.quant];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error adding inventory info to inventory.")
            return;
          }

          resolve("Inventory added succesfully.");
        }
      );
    }
    else if (type == "update") {
      sqlString = "UPDATE inventory " +
      "SET computer_id = ?, store_id = ?, quantity = ? " +
      "WHERE inventory_id = ?";
      values = [data.computer_id, data.store_id, data.quant, data.inventory_id];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error updating inventory info to inventory.")
            return;
          }

          resolve("Inventory updated succesfully.");
        }
      );
    }
    else if (type == "delete") {
      sqlString = "DELETE FROM inventory " +
        "WHERE inventory_id = ?";
      values = [data.inventoryId];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            console.log(err);
            reject("Error deleting inventory info in inventory.")
            return;
          }

          resolve("Inventory deleted succesfully.");
        }
      );
    }
  })
}

app.post('/inventory', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processInventoryRequest(type, data)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/stores', function (req, res) {
  let context = {};
  let scripts = ['js/stores.js', 'js/payloadBuilder.js', 'js/ajax.js'];
  let callBackCount = 0;

  getStores(res, db, context, complete);

  context.scripts = scripts;

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('stores', context);
    }
  }
});

var processStoresRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "add") {
      sqlString = "INSERT INTO stores " +
      "(street_address, city, state, zipcode) " +
      "VALUES (?, ?, ?, ?)";
      values = [data.address, data.city, data.state, data.zip];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error adding store info to stores.");
            return;
          }

          resolve("Store added succesfully to stores.");
        }
      );
    }
  })
}

app.post('/stores', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processStoresRequest(type, data)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

var getComputers = function() {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    sqlString = "SELECT computer_id, description, ram, hard_drive, screen_size FROM computer_systems"

    db.query(
      sqlString,
      function(err, result) {
        if (err) {
          reject("Error getting computer information from computer_systems");
          return;
        }

        resolve(result);
      }
    );
  })
}

app.get('/computers', function (req, res) {
  let context = {};
  let scripts = ['js/computers.js', 'js/payloadBuilder.js', 'js/ajax.js'];
  context.scripts = scripts;

  getComputers()
    .then((data) => {
      context.computers = data;
      res.render('computers', context);
    })
    .catch((error) => {
      res.render('computers', context);
    });

});

var processComputersRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    let sqlString = "";
    let values;

    if (type == "add") {
      sqlString = "INSERT INTO computer_systems " +
      "(description, ram, hard_drive, screen_size) " +
      "VALUES (?, ?, ?, ?)";
      values = [data.descr, data.ram, data.drive, data.screen];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error adding computer info to computer_systems.");
            return;
          }

          resolve("Computer added to computer_systems successfully.");
        }
      );
    }
    if (type == "delete") {
      sqlString = "DELETE FROM computer_systems " +
      "WHERE computer_id = ?";
      values = [data.computerId];

      db.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error deleting computer from computer_system");
            return;
          }

          resolve("Computer has been deleted successfully. Inventory rows will be deleted due to cascade. Corresponding rows in orders will be set to null.");
        }
      );
    }
  })
}

app.post('/computers', function(req, res, next) {
  payload = req.body;
  type = payload.type;
  data = payload.data;

  processComputersRequest(type, data)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Listening on flip3.engr.oregonstate.edu: ' + app.get('port'));
});
