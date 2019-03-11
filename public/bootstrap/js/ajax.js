$( document ).ready( function ( ){
	//var xhttp = new XMLHttpRequest();
	$( '#fileerror' ).hide( );
	$( '#progress' ).hide( );
	$( '#imagepic' ).hide( );
	$(':file#Picture').change(function(){
		var file  =  this.files[0];
		//alert( file.type )
		var asize = 2 * 1024 * 1024;
		if(( file.type === 'image/png' || file.type ==='image/jpg' || file.type === 'image/jpeg' ) && file.size <= asize){
			
			$( '#fileerror' ).hide();
			$( '#progress' ).show( );
			$( '#progress' ).html( 'File is loading........' );
			var reader = new FileReader( );
			var img = document.createElement( 'img' );
			reader.onloadend = function(){
				img.src  =  reader.result;
				img.width = 150;
				img.height = 250;
			}
			reader.readAsDataURL( file );
			$( '#Picture' ).after( img );
			$( '#progress' ).hide( );
				
		}else{
			$( '#fileerror' ).show(  );
			$( '#Picture' ).val( '' );	document .getElementById( 'fileerror' ).innerHTML  = 'File not accepted. Make sure the size is not more than 2mb. Also make sure its either png, jpg or jpeg.' 
			//alert( 'not ok' )
		}
	});
	//something else.... another function should go here.
	
	
});