var express = require('express');
var router = express.Router();
var con = require('../cons/cons');



/* GET home page. */
router.get('/', function(req, res, next) {
con.query("SELECT * FROM artikel", function(err, results){
    if (err) throw err;
        console.log("Result:" + results);
        console.log(results)
        res.render('all', {data: results});
    });
});

module.exports = router;
