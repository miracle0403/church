var db = require( './db.js' );

//create events table
db.query( 'CREATE TABLE IF NOT EXISTS events ( id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, event_name varchar( 255 ) NOT NULL, event_date DATETIME NOT NULL, venue varchar( 255 ) NOT NULL, image varchar ( 255 ) NOT NULL, description text NOT NULL )', function( err, results ){
	if( err ) throw err;
	console.log( 'events table created' );
});


db.query( 'CREATE TABLE IF NOT EXISTS attendance (event_name varchar( 255 ) NOT NULL, event_date DATETIME NOT NULL, address varchar( 255 ) NOT NULL, name varchar ( 255 ) NOT NULL, phone INT( 11 ) NOT NULL, email varchar ( 255 ) NOT NULL, whatsapp varchar ( 255 ) NULL, kingschat varchar ( 255 ) NULL, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP)', function( err, results ){
	if( err ) throw err;
	console.log( 'attendance table created' );
});