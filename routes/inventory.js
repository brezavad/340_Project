var db = require('../index.js');
var express = require('express');
var router = express.Router();

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

var getFormInfoInventoryPage = function() {
    return new Promise((resolve, reject) => {
      data = {};
      let sqlString = "SELECT store_id, street_address, city, state, zipcode FROM stores";
  
      db.query(
        sqlString,
        function(err, result) {
          if (err) {
            reject("Error getting store id list from stores.");
            return;
          }
  
          data.stores = result;
  
          sqlString = "SELECT computer_id, description FROM computer_systems"
  
          db.query(
            sqlString,
            function(err, result) {
              if (err) {
                reject("Error getting computer information from computer_systems");
                return;
              }
  
              data.computers = result;
              resolve(data);
            }
          );
        }
      );
    })
}
  
router.get('/inventory', function (req, res) {
    let context = {};
    let scripts = ['js/inventory.js', 'js/payloadBuilder.js', 'js/ajax.js'];
    context.scripts = scripts;
    let callBackCount = 0;
  
    getFormInfoInventoryPage()
    .then((data) => {
      context.stores = data.stores;
      context.computers = data.computers;
  
      getInventory(res, db, context, complete);
  
      function complete() {
        console.log(context);
        callBackCount++;
        if (callBackCount >= 1) {
          res.render('inventory', context);
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.render('inventory');
    });
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
  
router.post('/inventory', function(req, res, next) {
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

module.exports = router;
