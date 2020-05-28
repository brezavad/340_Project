var db = require('../index.js');
var express = require('express');
var router = express.Router();

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
  
router.get('/computers', function (req, res) {
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
  
router.post('/computers', function(req, res, next) {
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

module.exports = router;
