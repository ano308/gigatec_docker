var express = require('express');
var router = express.Router();
var con = require('../cons/cons');



router.get('/', function(req, res, next) {
    con.query(`SELECT artikel.* FROM artikel, warenkorb WHERE artikel.ID = warenkorb.IDArtikel and warenkorb.IDUser = 1`, function(err, results){
        if (err) throw err;
            console.log("Result:" + results);
            console.log(results)
            res.render('cart', {data: results});
        });
    });
    
module.exports = router;
    

