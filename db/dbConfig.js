const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_brezavad',
    password: 'UgweMT8aRq8wT3bKif',
    database: 'cs340_brezavad',
});

module.exports = connection;