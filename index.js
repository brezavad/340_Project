var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});
var request = require('request');
const db = require('./db/dbConfig');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 13131);
app.use(express.static('public'));

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
    `SELECT  store_id, street_address, city, state, zipcode FROM stores`,
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
    `SELECT cs.description, cs.ram, cs.screen_size, cs.hard_drive, inv.quantity, 
    s.street_address FROM computer_systems cs 
    INNER JOIN inventory inv ON cs.computer_id = inv.inventory_id 
    INNER JOIN stores s ON s.store_id = inv.inventory_id`,
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
  db.query(`SELECT o.order_id, cu.first_name, cu.last_name, co.computer_id, o.quantity FROM orders o 
INNER JOIN customers cu ON o.order_id = cu.customer_id
INNER JOIN inventory i ON i.inventory_id = o.order_id
INNER JOIN computer_systems co ON i.inventory_id = co.computer_id`,
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
  res.render('addcustomers');
});

app.get('/allcustomers', function (req, res) {
  let context = {};
  let callBackCount = 0;

  getCustomers(res, db, context, complete);

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('allcustomers', context);
    }
  }
});

app.get('/order', function (req, res) {
  res.render('order');
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
  let callBackCount = 0;

  getInventory(res, db, context, complete);

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('inventory', context);
    }
  }
});

app.get('/stores', function (req, res) {
  let context = {};
  let callBackCount = 0;

  getStores(res, db, context, complete);

  function complete() {
    callBackCount++;
    if (callBackCount >= 1) {
      res.render('stores', context);
    }
  }
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
