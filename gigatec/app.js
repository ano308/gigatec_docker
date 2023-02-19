var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var con = require('./cons/cons');
var os = require('os');


var indexRouter = require('./routes/index');
var all = require('./routes/all');




var app = express();
var session;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/all', all);

app.get('/', (req, res) => {
  const hostname = os.hostname();
  res.render('index', { hostname });
});


// Session manager
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "2890q39gbv8°4§730890#“≠}q2{|z3h/)%G+BR()U=FV(=HR*FH=BV",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));



app.get('/login',function(req,res,next) {
  session=req.session;
  if(session.userid){
      res.render('acc');
  }else
  res.render('login')
});


let sessionuserID
app.post('/acc',(req,res) => {
  var name = "\"" + req.body.username + "\"";
  con.query(`SELECT username, passwd FROM person WHERE username = ${name}`, function (err, results) {
    if (err){
      console.log(typeof(err)); 
      for (var k in err){
        console.log(`${err[k]}`)
        return;
      }
    }else{
      if(results.length == 0) // check
        {
          res.render('login')
          return;
        }
      if(req.body.username == results[0].username && req.body.password == results[0].passwd){
        session=req.session;
        con.query(`SELECT ID from person WHERE username = ${name}`,(err, results)=>{
        if (err) {
          console.log(err);
        } else {
          sessionuserID = results;
          res.render('acc');
        }
        
      });
      }else{ 
      res.send('Invalid username or password');
    }
  }
  });
});








app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
  });




app.get('/cart', function(req, res) {
  con.query(`SELECT artikel.* FROM artikel, warenkorb WHERE artikel.ID = warenkorb.IDArtikel and warenkorb.IDUser = ?`, [sessionuserID[0].ID], function(err, results){
  if (err) throw err;
      console.log("Result:" + results);
      console.log(results)
      res.render('cart', {data: results});
  });
});

app.post('/add-to-cart', function(req, res) {
  let productId = req.body.productId;
  console.log(productId)
  con.query("INSERT INTO warenkorb (IDArtikel, IDUser) VALUES (?,?)", [productId, sessionuserID[0].ID], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product added to cart' });
  });
});

app.post('/remove-from-cart', function(req, res) {
  let productId = req.body.productId;
  console.log(productId)
  con.query("DELETE FROM warenkorb WHERE IDArtikel = ? AND IDUser = ? LIMIT 1;", [productId, sessionuserID[0].ID], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product deletet from cart' });
  });
});

app.get('/wishlist', function(req, res) {
  con.query(`SELECT artikel.* FROM artikel, wunschliste WHERE artikel.ID = wunschliste.IDArtikel and wunschliste.IDUser = ?`, [sessionuserID[0].ID], function(err, results){
  if (err) throw err;
      console.log("Result:" + results);
      console.log(results)
      res.render('wishlist', {data: results});
  });
});


app.post('/add-to-wishlist', function(req, res) {
  let productId = req.body.productId;
  console.log(productId)
  con.query("INSERT INTO wunschliste (IDArtikel, IDUser) VALUES (?,?)", [productId, sessionuserID[0].ID], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product added to wishlist' });
  });
});

app.post('/remove-from-wishlist', function(req, res) {
  let productId = req.body.productId;
  console.log(productId)
  con.query("DELETE FROM wunschliste WHERE IDArtikel = ? AND IDUser = ? LIMIT 1;", [productId, sessionuserID[0].ID], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product deletet from wishlist' });
  });
});



 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
