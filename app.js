var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var con = require('./cons/cons');


var indexRouter = require('./routes/index');
var all = require('./routes/all');
var about = require('./routes/about');
var contact = require('./routes/contact');
var return_policy = require('./routes/return_policy');


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
app.use('/about', about);
app.use('/contact', contact);
app.use('/return_policy', return_policy);

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
      res.render('index');
  }else
  res.render('login')
});

app.post('/acc',(req,res) => {
  var name = req.body.username;
  con.query(`SELECT username, passwd FROM person WHERE username = ?`, [name], function (err, results) {
    if (err){
      console.log(typeof(err));
      for (var k in err){
        console.log(`${err[k]}`)
        return;
      }
    }
    else
    {
      if(results == "")
        {
          res.render('login')
          return;

        }
    }


  if(req.body.username == results[0]?.username && req.body.password == results[0]?.passwd){
    session=req.session;
    session.userid=req.body.username;
    console.log(req.session)
    res.render('index');
  }

    else{
      res.send('Invalid username or password');
    }

  })
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/signup', function(req,res,next){
    res.render('signup')
  });

  // Check for duplicate
app.post('/confirm', (req,res)=> {
  var name = "\"" + req.body.name + "\"";
  var surname = "\"" + req.body.surname + "\"";
  var mail = "\"" + req.body.mail + "\"";
  var username = "\"" + req.body.username + "\"";
  var password = "\"" + req.body.password + "\"";
  var address = "\"" + req.body.address + "\"";
  con.query(`INSERT INTO person VALUES(
    null,?,?,?,?,'1',?,?)`,[name, surname, address, mail, password, username])
  res.redirect('login')
});


//wishlist

app.get('/wishlist',(req,res)=>{
  session=req.session;
  if(session.userid){
    console.log(session.userid)
    con.query(`SELECT a.ID, a.name, a.preis, a.bilder FROM artikel as a JOIN wunschliste as w on a.ID = w.IDArtikel JOIN person as p on p.ID = w.IDUser WHERE p.username = ?`, [session.userid], 
    function (err, results){
      if (err){
        console.log(typeof(err));
        for (var k in err){
          console.log(`${err[k]}`)
          return;
        }
      }
      else
      {
        if(results.length == 0)
        {
          console.log(results)
          
        }
        res.render('wishlist', {data: results})
  }
})
  }else{
  res.render('login')  
  }
});

// Cart
app.get('/cart',(req,res)=>{
  session=req.session;
  if(session.userid){
    console.log(session.userid)
    con.query(`SELECT a.ID, a.name, a.preis, a.bilder FROM artikel as a JOIN warenkorb as w on a.ID = w.IDArtikel JOIN person as p on p.ID = w.IDUser WHERE p.username = ?`, [session.userid], 
    function (err, results){
      if (err){
        console.log(typeof(err));
        for (var k in err){
          console.log(`${err[k]}`)
          return;
  
        }
      }
      else
      {
        if(results.length == 0)
        {
          console.log(results)
          
        }
        res.render('cart', {data: results})
  }
})
  }else{
  res.render('login')  
  }
});

app.post('/add-to-cart', function(req, res) {
  let productId = req.body.productId;
  let user = req.session.userid;
  con.query("INSERT INTO warenkorb (IDArtikel, IDUser) VALUES(?,(SELECT ID FROM person WHERE username = ?));", [productId, user], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product added to cart' });
  });
});

app.post('/remove-from-cart', function(req, res) {
  let productId = req.body.productId;
  let user = req.session.userid;
  con.query("DELETE FROM warenkorb WHERE IDArtikel = ? AND IDUser = (SELECT ID FROM person WHERE username = ?) LIMIT 1", [productId,user], function(err, results) {
      if (err) throw err;
      res.redirect('cart');
  });
});

app.post('/add-to-wishlist', function(req, res) {
  let productId = req.body.productId;
  let user = req.session.userid;
  con.query("INSERT INTO wunschliste (IDArtikel, IDUser) VALUES(?,(SELECT ID FROM person WHERE username = ?));", [productId, user], function(err, results) {
      if (err) throw err;
      res.send({ message: 'Product added to wishlist' });
  });
});



app.post('/remove-from-wishlist', function(req, res) {
  let productId = req.body.productId;
  console.log("ProductID:" + productId)
  let user = req.session.userid;
  console.log("ProductID:" + user)
  con.query("DELETE FROM wunschliste WHERE IDArtikel = ? AND IDUser = (SELECT ID FROM person WHERE username = ?) LIMIT 1", [productId,user], function(err, results) {
    if (err) throw err;
    res.redirect('wishlist');
  });
});


app.get('/category/:kat', (req,res)=> {
  let cat =req.params.kat
  con.query('SELECT * FROM artikel WHERE IDKat = (SELECT ID FROM kategorie WHERE Bezeichnung = ?)',[cat], function(err,results){
    if (err) throw err;
    res.render('all', {data: results})
  })


});


app.get('/all/:prod', (req,res)=> {
  let cat =req.params.prod
  con.query('SELECT * FROM artikel WHERE ID = ?',[cat], function(err,results){
    if (err) throw err;
    console.log(results[0]);
    if (results.length==0){
      console.log('faulty item')
      res.render('index')
    }else{
      res.render('product', {data: results[0]})
    }
  })


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
