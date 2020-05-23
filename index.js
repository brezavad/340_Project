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

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/addcustomers', function (req, res) {
  res.render('addcustomers');
});

app.get('/allcustomers', function (req, res)  {
  const getCustomersQuery =
    'SELECT customer_id, first_name, last_name, email FROM customers';
  const customerData = [];
  const queryCallback = function (err, rows) {
    if (err) {
      throw err;
    }
    for (let i = 0; i < rows.length; i++) {
      customerData.push(rows[i]);
    }
  }
  process.nextTick(queryCallback);
  db.query(getCustomersQuery, process.nextTick(queryCallback));
  res.render('allcustomers', {customers: customerData});
  console.log(customerData);
  
});

app.get('/order', function (req, res) {
  res.render('order');
});

app.get('/allorders', function (req, res) {
  res.render('allorders');
});

app.get('/inventory', function (req, res) {
  res.render('inventory');
});

app.get('/stores', function (req, res) {
  res.render('stores');
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
