var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('./dbcon.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 33313);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('home');
});

var processRequest = function(type, data) {
  return new Promise((resolve, reject) => {
    var sqlString = "";
    var values;

    if (type == "initial") {
      mysql.pool.query(
        "SELECT * from workouts",
        function(err, rows, fields) {
          if (err) {
            reject("Error: there was an error retrieving data from server.");
            return;
          }
          
          resolve(rows);
          return;
        }
      );
    }
    else {
      if (data.name == "") {
        reject("Data not submitted. Name must be provided.");
        return;
      }

      if (type == "submit") {
        sqlString = "INSERT INTO workouts " +
        "(name, reps, weight, date, lbs) " +
        "VALUES (?, ?, ?, ?, ?)";
        values = [data.name, data.reps, data.weight, data.date, data.unit];
      }
      else if (type == "update") {
        sqlString = "UPDATE workouts " +
        "SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?";
        values = [data.name, data.reps, data.weight, data.date, data.unit, data.id];
      }
      else if (type == "delete") {
        sqlString = "DELETE FROM workouts " +
        "WHERE id = ?";
        values = [data.id];
      }

      mysql.pool.query(
        sqlString,
        values,
        function(err, result) {
          if (err) {
            reject("Error: there was an error sending data to server.");
            return;
          }

          mysql.pool.query(
            "SELECT * from workouts",
            function(err, rows, fields) {
              if (err) {
                reject("Error: there was an error retrieving data from server.");
                return;
              }
        
              resolve(rows);
            }
          );
        }
      );
    }
  })
}

app.post('/', function(req, res, next) {
  var context = {};
  var payload = req.body;
  var type = payload.type;
  var data = payload.data;

  processRequest(type,data)
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err) {
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.reset = "Table reset";
      res.render('home',context);
    })
  });
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
