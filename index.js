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

module.exports = db;

app.use(require('./routes/index.js'));
app.use(require('./routes/addcustomers.js'));
app.use(require('./routes/allcustomers.js'));
app.use(require('./routes/order.js'));
app.use(require('./routes/allorders.js'));
app.use(require('./routes/stores.js'));
app.use(require('./routes/computers.js'));
app.use(require('./routes/inventory.js'));

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
  console.log('Express server listening on port ' + app.get('port'));
});
