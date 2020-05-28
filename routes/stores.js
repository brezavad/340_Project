var db = require('../index.js');
var express = require('express');
var router = express.Router();

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

router.get('/stores', function (req, res) {
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
  
router.post('/stores', function(req, res, next) {
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

module.exports = router;
