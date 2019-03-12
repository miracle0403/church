'use strict';
const nodemailer = require('nodemailer'); 
var formidable = require('formidable');
var express = require('express');
var router = express.Router();
var ensureLoggedIn =  require('connect-ensure-login').ensureLoggedIn
var util = require('util');
var csrf = require('csurf');
var securePin = require('secure-pin');
var fs = require('fs');
var bodyParser = require( 'body-parser' );
var passport = require('passport');
var db = require('../db.js'); 
var bcrypt = require('bcrypt-nodejs');
var securePin = require('secure-pin');
var path = require('path');
var url = require('url'); 
var math = require( 'mathjs' );
var formevents = require( '../functions/forms.js' );


function rounds( err, results ){ 
	if ( err ) throw err;
}
var csrfProtection = csrf({ cookie: true })

var parseForm = bodyParser.urlencoded({ extended: false })

const saltRounds = bcrypt.genSalt( 10, rounds);


//adminfunction
function admin(x, y, j){
	y.query('SELECT user FROM admin WHERE user = ?', [x], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			j.redirect('/404');
		}else{
			var admin = x;
			j.render('upload', {title: 'ADMIN CORNER', admin: admin});
		}
	});
}

//get home 
router.get('/',  function(req, res, next) {
	//get the top three events
	db.query( 'SELECT * FROM events WHERE status = ? ORDER BY id LIMIT 3',  ['Up coming'], function(err, results, fields){
		if( err ) throw err;
		var events = results;
		var urgentEvent = results[0];
		//get the top national news.
		db.query( 'SELECT * FROM nationalnews ORDER BY id DESC LIMIT 3',  function(err, results, fields){
			if( err ) throw err;
			var NationalNews = results;
			var topNational = results[0];
			db.query( 'SELECT * FROM loveworldnews ORDER BY id DESC LIMIT 3', function(err, results, fields){
				if( err ) throw err;
				var loveworld = results;
				var toploveWorld = results[0];
				db.query( 'SELECT * FROM messages ORDER BY id DESC LIMIT 3', function(err, results, fields){
					if( err ) throw err;
					var messages = results;
					db.query( 'SELECT affirmation_date, Topic FROM affirmation ORDER BY affirmation_date DESC LIMIT 7', function(err, results, fields){
						if( err ) throw err;
						var affirmation = results;
						db.query( 'SELECT devotional_date, Topic FROM devotional ORDER BY devotional_date DESC LIMIT 7', function(err, results, fields){
							if( err ) throw err;
							var devotional = results;
							db.query( 'SELECT * FROM quotes ORDER BY entered DESC LIMIT 1', function(err, results, fields){
								if( err ) throw err;
								var quotes = results
								res.render('index', {title: "LOVEWORLD", quotes: quotes, affirmation: affirmation, devotional: devotional, urgentEvent: urgentEvent, events: events, loveworld: loveworld, messages:messages, topNational: topNational, toploveWorld: toploveWorld, nationalNews: NationalNews});
							});
						});
					});
				});
			});
		});
	});
});

//get events 
router.get('/events',  function(req, res, next) {
	db.query( 'SELECT event_name FROM events WHERE status = ?  ORDER BY id',  ['Up coming'], function(err, results, fields){
		if( err ) throw err;
		var events = results;
		res.render('events', {title: 'UP COMING EVENTS', events: events});
	});
});

//get devotional 
router.get('/devotional/:topic',  function(req, res, next) {
	var topic = req.params.topic;
	db.query( 'SELECT * FROM devotional WHERE Topic = ?',  [topic], function(err, results, fields){
		if( err ) throw err;
		var devotional = results;
		res.render('devotional', {title: 'Rhapsody Of Realities', devotional: devotional});
	});
});

//get affirmation
router.get('/affirmation/:topic',  function(req, res, next) {
	var topic = req.params.topic;
	db.query( 'SELECT * FROM affirmation WHERE Topic = ?',  [topic], function(err, results, fields){
		if( err ) throw err;
		var affirmation = results;
		res.render('affirmation', {title: 'AFFIRMATION TRAIN', affirmation: affirmation});
	});
});


//ensureLoggedIn( '/login' ),
//get upload
router.get('/admin', ensureLoggedIn('/login'), function(req, res, next) {
	//get the category.
	var currentUser = req.session.passport.user.user_id;
	admin(currentUser, db, res);
});


//get login
router.get('/login', function(req, res, next) {  
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			title: 'LOGIN',
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		res.render('login', { title: 'LOG IN'});
	}
});


//register get request
router.get('/register',  function(req, res, next) {	
    res.render('register',  { title: 'REGISTRATION'});
});
//csrfToken: req.csrfToken()
//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

//post add status.
router.post('/eventstatus', function(req, res, next) {
	var eventstatus = req.body.eventstatus;
	var id = req.body.id;
	db.query( 'UPDATE events SET status  = ? WHERE id = ?', [eventstatus, id], function ( err, results, fields ){
		if(err) throw err;
		res.render('upload', {title: 'ADMIN CORNER', statussuccess: 'Update was successful'});
	});
});


//post search.
router.post('/joinevent', parseForm, function(req, res, next) {
	req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,100);
	req.checkBody('address', 'Address must be between 10 to 100 characters').len(10,100);
	req.checkBody('whatsapp', 'WhatsApp must be between 8 to 25 characters').len(8,100);
	req.checkBody('kingschat', 'Kings Chat must be between 10 to 100 characters').len(10,100);
	req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('phone', 'Phone Number must be 14 characters').len(14);
	req.checkBody( 'phone', 'Phone Number should be a Number' ).isMobilePhone();
	/*
	req.sanitizeBody('fullname').trim().escape();
	req.sanitizeBody('address').trim().escape();
	req.sanitizeBody('whatsapp').trim().escape();
	req.sanitizeBody('kingschat').trim().escape();
	req.sanitizeBody('phone').trim().escape();
	req.sanitizeBody('email').trim().escape();*/
	
	var address = req.body.address;
	var email = req.body.email;
	var fullname = req.body.fullname;
	var phone = req.body.phone;
	var events = req.body.events;
	var wa = req.body.whatsapp;
	var ks = req.body.kingschat;
	
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('events', { title: 'REGISTRATION FAILED', errors: errors});
	}else{
		db.query( 'SELECT phone FROM attendance WHERE phone = ? and event_name = ?', [phone, events], function ( err, results, fields ){
			if(err) throw err;
			if (results.length > 0){
				var error = fullname + ' We think you have indicated interest to attend this event already and we reserved a special place for you.';
				res.render('events', {title: 'Up Coming Events', error: error});
			}else{
				db.query( 'SELECT start FROM events WHERE event_name = ?', [events], function ( err, results, fields ){
					if(err) throw err;
					var start = results[0].start;
					db.query('INSERT INTO attendance (event_name, event_date, address, phone, email, whatsapp, kingschat) VALUES (?, ?, ?, ?, ?, ?, ?)', [events, start, address, phone, email, wa, ks], function(err,results, fields){
						if (err)  throw err;
						//insert into database
						var success = 'You are good to go ' + fullname + '!  See you at ' + events;
						res.render('events', {title: 'Up Coming Events', success: success});
					});
				});
			}
		});
	}
});


//post log in
router.post('/login', parseForm, passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/admin',
  failureFlash: true
}));

//add new admin
router.post('/addadmin', parseForm, function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {adderror: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					db.query('INSERT INTO admin ( user ) values( ? )', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'New Admin Added Successfully!';
						res.render('upload', {addsuccess: success });
					});
				}
				if( results.length > 0 ){
					var error = 'This user is already an Admin';
					res.render('upload', {adderror: error });
				} 
			});
		}
	});
});

//add devotional
router.post('/adddevotional', function (req, res, next) {
	var topic = req.body.topic;
	var date = req.body.date;
	var description = req.body.description;
	//check if it has been added  before
	db.query('SELECT topic FROM devotional WHERE topic = ?', [topic], function(err, results, fields){
		if( err ) throw err;
		if(results.length > 0){
			var error = 'You have added this topic before';
			res.render('upload', {devoerror: error });
		}else{
			db.query('INSERT INTO devotional (news, topic, devotional_date) VALUES (?, ?, ?)', [description, topic, date], function(err,results, fields){
				if (err)  throw err;
				var success = 'New devotional added successfully';
				res.render('upload', {devosuccess: success });
			});
		}
	});
});

//add affirmation
router.post('/addaffirmation', function (req, res, next) {
	var topic = req.body.topic;
	var date = req.body.date;
	var description = req.body.description;
	//check if it has been added  before
	db.query('SELECT topic FROM affirmation WHERE topic = ?', [topic], function(err, results, fields){
		if( err ) throw err;
		if(results.length > 0){
			var error = 'You have added this topic before';
			res.render('upload', {affirerror: error });
		}else{
			db.query('INSERT INTO affirmation (news, topic, affirmation_date) VALUES (?, ?, ?)', [description, topic, date], function(err,results, fields){
				if (err)  throw err;
				var success = 'New Affirmation added successfully';
				res.render('upload', {affirsuccess: success });
			});
		}
	});
});

//add lwnews
router.post('/addlwnews', function (req, res, next) {
	var topic = req.body.topic;
	var link = req.body.link;
	var description = req.body.description;
	//check if it has been added  before
	db.query('SELECT Topic FROM loveworldnews WHERE Topic = ?', [topic], function(err, results, fields){
		if( err ) throw err;
		if(results.length > 0){
			var error = 'You have added this topic before';
			res.render('upload', {lwerror: error });
		}else{
			db.query('INSERT INTO loveworldnews (highlights, Topic, link) VALUES (?, ?, ?)', [description, link, topic], function(err,results, fields){
				if (err)  throw err;
				var success = 'New Love World News added successfully';
				res.render('upload', {lwsuccess: success });
			});
		}
	});
});


//add nlnews
router.post('/addnlnews', function (req, res, next) {
	var topic = req.body.topic;
	var link = req.body.link;
	var description = req.body.description;
	//check if it has been added  before
	db.query('SELECT Topic FROM nationalnews WHERE Topic = ?', [topic], function(err, results, fields){
		if( err ) throw err;
		if(results.length > 0){
			var error = 'You have added this topic before';
			res.render('upload', {nlerror: error });
		}else{
			db.query('INSERT INTO nationalnews (news, Topic, link) VALUES (?, ?, ?)', [description, link, topic], function(err,results, fields){
				if (err)  throw err;
				var success = 'New National News added successfully';
				res.render('upload', {nlsuccess: success });
			});
		}
	});
});

//add quotes
router.post('/quotes', function (req, res, next) {
	var speaker = req.body.speaker;
	var quote = req.body.quote;
	
	//check if it has been added  before
	db.query('INSERT INTO quotes (speaker, quotes) VALUES (?, ?)', [speaker, quote], function(err,results, fields){
		if (err)  throw err;
		var success = 'New Quote added successfully';
		res.render('upload', {qusuccess: success });
	});	
});

//delete admin
router.post('/deladmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {adminerror: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					var error = 'Sorry this admin does not exist.';
					res.render('upload', {adminerror: error });
				}
				else {
					db.query('DELETE FROM admin WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'Admin deleted successfully!'
						res.render('upload', {adminsuccess: success });
					});
				}
			});
		}
	});
});

router.post('/createEvent', function(req, res, next) {
	//var category = req.body.category;
	if (req.url == '/createEvent' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var sepa = ':';
		var form = new formidable.IncomingForm();
		form.uploadDir = '/Users/STAIN/desktop/sites/church/public/images/events';
		form.maxFileSize = 4 * 1024 * 1024;
		form.parse(req, function(err, fields, files) {
			var Name = fields.name;
			var venue = fields.venue;
			var startdate = fields.startdate;
			var starttime = fields.starttime;
			
			var start = startdate + ':' + starttime;
			console.log(startdate);
			var stopdate = fields.stopdate;
			var stoptime = fields.stoptime;
			
			
			var stop = stopdate + ':' + stoptime;
			console.log(stop);
			var description = fields.description;
			console.log(fields);
			var getfiles = JSON.stringify( files );
			var file = JSON.parse( getfiles );
			var oldpath = file.img.path;
			//console.log(oldpath, typeof oldpath, typeof file, file.path, typeof file.path);
			var name = file.img.name;
			form.keepExtensions = true;
			var newpath = '/Users/STAIN/desktop/sites/church/public/images/events/' + name;
			var img = '/images/events/' + name;
			form.on('fileBegin', function( name, file){
				//rename the file
				fs.rename(oldpath, newpath, function(err){
					if (err) throw err;
					//console.log('file renamed');
				});
				//save in the database.
					db.query('INSERT INTO events (image, venue, status, start, stop, description, event_name) VALUES (?, ?, ?, ?, ?, ?, ?)', [img, venue, 'Up coming', start, stop, description, Name], function(err,results, fields){
						if (err)  throw err;
						res.render('upload', {title: 'ADMIN CORNER', createeventsuccess: 'Event Added'});
					});
			});
			form.emit('fileBegin', name, file);
	    });
	}
});


router.post('/newmessage',  function(req, res, next) {
	//var category = req.body.category;
	if (req.url == '/newmessage' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var sepa = ':';
		var form = new formidable.IncomingForm();
		form.uploadDir = '/Users/STAIN/desktop/sites/church/public/images/messages/';
		form.maxFileSize = 4 * 1024 * 1024;
		form.parse(req, function(err, fields, files) {
			var message = fields.messagetitle;
			var minister = fields.minister;
			var date = fields.date;
			var time = fields.time;
			var link = fields.link;
			
			var preaches = date + ':' + time;
			
			var description = fields.description;
			console.log(fields);
			var getfiles = JSON.stringify( files );
			var file = JSON.parse( getfiles );
			var oldpath = file.vid.path;
			//console.log(oldpath, typeof oldpath, typeof file, file.path, typeof file.path);
			var name = file.vid.name;
			form.keepExtensions = true;
			var newpath = '/Users/STAIN/desktop/sites/church/public/images/messages//' + name;
			var img = '/images/messages/' + name;
			form.on('fileBegin', function( name, file){
				//rename the file
				fs.rename(oldpath, newpath, function(err){
					if (err) throw err;
					//console.log('file renamed');
				});
				//save in the database.
					db.query('INSERT INTO messages (link, description, video, date_preached) VALUES (?, ?, ?, ?)', [link, description, img, preaches], function(err,results, fields){
						if (err)  throw err;
						res.render('upload', {title: 'ADMIN CORNER', messagesuccess: 'New Message Added'});
					});
			});
			form.emit('fileBegin', name, file);
	    });
	}
});


//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});


//post the register
//var normal = require( '../functions/normal.js' );
router.post('/register',  function (req, res, next) {
	req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
	req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
	req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
	req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
	req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('code', 'Country Code must not be empty.').notEmpty();
	req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
	//req.checkBody('pass1', 'Password must include an upper case, a lower case, a number and a special character').matches(/^(?=.*\d)(?=.[a-z])(?=.[A-Z])(?!.*)(?=.[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('phone', 'Phone Number must be ten characters').len(10);
	req.checkBody('address', 'Address must be 200 characters').len(10, 200);
	req.checkBody( 'phone', 'Phone Number should be a Number' ).isNumeric( );
	
	/*req.sanitizeBody('fullname').trim().escape();
	req.sanitizeBody('address').trim().escape();
	req.sanitizeBody('username').trim().escape();
	req.sanitizeBody('code').trim().escape();
	req.sanitizeBody('phone').trim().escape();
	req.sanitizeBody('email').trim().escape();
	req.sanitizeBody('pass1').trim().escape();
	req.sanitizeBody('pass2').trim().escape();*/
	
	var csrf = req.body.csrf;
	var username = req.body.username;
	var password = req.body.pass1;
	var cpass = req.body.pass2;
	var email = req.body.email;
	var fullname = req.body.fullname;
	var code = req.body.code;
	var phone = req.body.phone;
	var address = req.body.address;
	
	console.log(req.body);
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('register', { title: 'REGISTRATION FAILED', errors: errors, address: address, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
	}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          	if (err) throw err;
			
          	if(results.length===1){
          		var error = "Sorry, this username is taken";
				console.log(error);
				res.render('register', {title: "REGISTRATION FAILED", error: error, address: address, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
          	}else{
				//check the email
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
          			if (err) throw err;
          			if(results.length===1){
          				var error = "Sorry, this email is taken";
            			console.log(error);
						res.render('register', {title: "REGISTRATION FAILED", error: error, address: address, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
            		}else{
						bcrypt.hash(password, saltRounds, null, function(err, hash){
							db.query( 'INSERT INTO user (full_name, phone, address, username, email, code, password) VALUES(?, ?, ?, ?, ?, ?, ?)', [ fullname, phone, address, username, email, code, hash], function(err, result, fields){
								if (err) throw err;
								var success = 'Successful registration';
								res.render('register', {title: 'REGISTRATION SUCCESSFUL!', success: success});
							});
						});
					}
				});
			}
		});
	}
});

/*router.get('/404', function(req, res, next) {
  res.render('404', {title: 'PAGE NOT FOUND', message: 'Ooops  since you got lost somehow but i am here to catch you. see our quick links.'});
});*/
router.get( '*', function ( req, res, next ){
	res.redirect( '/' )
});
module.exports = router;