var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 13331);
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/order', function(req, res) {
  res.render('order');
});

app.get('/customers', function(req, res) {
  res.render('customers');
});

app.get('/allorders', function(req, res) {
  res.render('allorders');
});

app.get('/inventory', function(req, res) {
  res.render('inventory');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Listening on flip3.engr.oregonstate.edu: ' + app.get('port'));
});
