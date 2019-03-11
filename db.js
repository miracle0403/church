var mysql = require ('mysql');
var server = require ('./app.js');
//var tables = require( './tables.js' );

var pool  = mysql.createPool({
  multipleStatements: true,
  connectionLimit : 100,
  waitForConnections: true,
  host: "localhost",
  user: "root",
  //password: 'ifeysamuel',
  database: "church"
});

pool.getConnection( function ( err, con ){
	if ( err ){
		console.log( 'no connection to pool' )
	}
	else{
		con.query( 'SELECT 1 + 4 AS solution', function ( err, results, fields ){
			if ( err ) throw err;
			else{
			console.log( 'solution is ' + results[0].solution);
			pool.releaseConnection( con );
			}
		});
	}
});
module.exports = pool;