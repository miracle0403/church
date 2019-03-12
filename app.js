'use strict'
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var  csurf = require('csurf');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var logger = require('morgan');
//var env  = require('dotenv').config();
var hbs = require('express-handlebars');
//var paginate = require('handlebars-paginate');
//const path = require('path');
var fs = require('fs');

//upload requirements
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var myConnection = require('express-myconnection'); // express-myconnection module 
var formidable = require('formidable');

//Authentication packages
var bcrypt = require('bcrypt-nodejs');
var securePin = require('secure-pin');
var passport = require('passport');
var localStrategy = require('passport-local'),Strategy;
var session = require('express-session');
var MySQLStore = require ('express-mysql-session')(session);
var flash = require('express-flash-messages');
var db = require('./db.js'); 
var hbs  = require('hbs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tables = require( './tables.js' );
//var paginate = require('express-handlebars-paginate');
var app = express();


 //view set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//create helper
hbs.registerHelper('paginate', require('handlebars-paginate'));
//register partials

var mainseoTemplate = fs.readFileSync(__dirname + '/views/mainseo.hbs', 'utf8');
hbs.registerPartial('mainseo', mainseoTemplate); 


//middlewares.
app.use(helmet({
	frameguard: {

    action: 'deny'

}
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
  waitForConnections: true,
  connectionLimit : 100,
  host: "localhost",
  user: "root",
  //password: 'ifeysamuel',
  database: "church"
};

app.use(myConnection(mysql, options, 'pool')); 

var sessionStore = new MySQLStore(options);
  
  
app.set( 'trust proxy', 1 );

//var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

app.use(session({
  secret: 'the church loveworld nation we are kinging! yeah! i know who i am.',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  name: 'LoveWord',
  cookie: {
    secure: true,
    httpOnly: true,
    //maxAge: expiryDate
	}    
}));

//app.use(csurf());

// error handler
/*app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here
  res.status(403)
  res.send('You do not have permission to view this page')
})*/

/*app.use(function(req, res, next) {
	res.locals.csrf = req.csrfToken();
	next();
});*/

  //passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next(); 
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

passport.use(new localStrategy(function(username, password, done){
    console.log(username);
    console.log(password);
	db.query('SELECT user_id, email, password FROM user WHERE username = ?', [username], function (err, results, fields){
		if (err) {done(err)};
		if (results.length === 0){
			console.log('false usename')
			done(null, false, {
				message: 'Invalid Username'
			});
		}else{
			var email = results[0].email;
			const hash = results[0].password.toString();
			bcrypt.compare(password, hash, function(err, response){
				if (response === true){
					//console.log('good details')
					return done(null, {user_id: results[0].user_id});
				}else{
					console.log('false password')
					return done(null, false,{
						message:'Invalid Password'
					});
				}
			});
		}
	});
}));

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