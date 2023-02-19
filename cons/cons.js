var mysql = require('mysql');


var con = mysql.createConnection({
host: "db",
user: "root",
password: "5lovDive6!",
database: "gigatec"
});

con.connect(function(err) {
    if (err) throw err;
    	console.log("Connected!");
});

module.exports = con
