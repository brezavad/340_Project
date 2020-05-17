const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_blanjohn',
    password: '7630',
    database: 'cs340_blanjohn'
});

module.exports = connection;