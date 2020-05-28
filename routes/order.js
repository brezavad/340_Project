var db = require('../index.js');
var express = require('express');
var router = express.Router();

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
  
router.get('/order', function (req, res) {
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
  
router.post('/order', function(req, res, next) {
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

module.exports = router;
