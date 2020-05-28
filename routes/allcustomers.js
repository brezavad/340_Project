var db = require('../index.js');
var express = require('express');
var router = express.Router();

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

router.get('/allcustomers', function (req, res) {
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
  
router.post('/allcustomers', function(req, res, next) {
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

module.exports = router;