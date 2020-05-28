var db = require('../index.js');
var express = require('express');
var router = express.Router();
// var db = require('../db/dbConfig');

// db.connect(function (err) {
//     if (err) {
//       console.log(err.message);
//       return;
//     }
//     console.log('Connected to database');
// });

router.get('/addcustomers', function (req, res) {
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
  
router.post('/addcustomers', function(req, res, next) {
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

module.exports = router;
