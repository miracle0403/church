var db = require( './db.js' );

//create events table
db.query( 'CREATE TABLE IF NOT EXISTS events ( id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, status varchar (255) NOT NULL, event_name varchar( 255 ) NOT NULL, start DATETIME NOT NULL, stop DATETIME NOT NULL, venue varchar( 255 ) NOT NULL, image varchar ( 255 ) NOT NULL, description text NOT NULL )', function( err, results ){
	if( err ) throw err;
	console.log( 'events table created' );
});


db.query( 'CREATE TABLE IF NOT EXISTS attendance (event_name varchar( 255 ) NOT NULL, event_date DATETIME NOT NULL, address varchar( 255 ) NOT NULL, name varchar ( 255 ) NOT NULL, phone BIGINT NOT NULL, email varchar ( 255 ) NOT NULL, whatsapp varchar ( 255 ) NULL, kingschat varchar ( 255 ) NULL, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'attendance table created' );
});

//create events table
db.query( 'CREATE TABLE IF NOT EXISTS messages ( id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, link varchar(255) NOT NULL, date_preached DATETIME NOT NULL, video varchar ( 255 ) NOT NULL, description text NOT NULL )', function( err, results ){
	if( err ) throw err;
	console.log( 'messages table created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS news (topic varchar( 255 ) NOT NULL, description varchar ( 255 ) NOT NULL, image varchar( 255 ) null, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'news table created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS devotional (Topic varchar( 255 ) NOT NULL, devotional_date DATETIME NOT NULL, devotional text NOT NULL)', function( err, results ){
	if( err ) throw err;
	console.log( 'devotional table created' );
})

db.query( 'CREATE TABLE IF NOT EXISTS affirmation (topic varchar( 255 ) NOT NULL, affirmation_date DATETIME NOT NULL, news text NOT NULL)', function( err, results ){
	if( err ) throw err;
	console.log( 'affirmation table created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS quotes (speaker varchar( 255 ) NOT NULL, quotes text NOT NULL, entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'quotes table created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS loveworldnews (id INT(11) PRIMARY KEY AUTO_INCREMENT, Topic varchar( 255 ) NOT NULL, news text NOT NULL, highlights varchar (255) NOT NULL, published_date DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'loveworldnews table created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS nationalnews (id INT(11) PRIMARY KEY AUTO_INCREMENT, Topic varchar( 255 ) NOT NULL, link varchar (255) NOT NULL, news text NOT NULL, published_date DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'national news created' );
});

db.query( 'CREATE TABLE IF NOT EXISTS admin (user INT(11) NOT NULL, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)', function( err, results ){
	if( err ) throw err;
	console.log( 'admin table created' );
});

var user = 'CREATE TABLE IF NOT EXISTS user ( user_id INT( 11 ) PRIMARY KEY AUTO_INCREMENT NOT NULL, username varchar( 255 ) UNIQUE NOT NULL, address varchar( 255 ) NOT NULL, full_name varchar ( 255 ) NOT NULL, email varchar ( 255 ) UNIQUE NOT NULL, phone VARCHAR(255) NOT NULL, code INT( 11 ) NOT NULL, password varchar( 255 ) NOT NULL, date_registered DATETIME  DEFAULT CURRENT_TIMESTAMP)';
db.query( user, function( err, results ){
	if( err ) throw err;
	console.log( 'user table created' );
});