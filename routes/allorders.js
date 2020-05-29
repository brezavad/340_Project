var db = require('../index.js');
var express = require('express');
var router = express.Router();

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
  
        // console.log(results);
  
        context.orders = results;
        complete();
      }
    );
}

router.get('/allorders', function (req, res) {
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

module.exports = router;
