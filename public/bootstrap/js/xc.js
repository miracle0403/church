	var dt = new FormData();
			dt.append( 'file', $( '#Picture' )[0].files[0]);
			
			
			$.ajax({
				url: '/upload',
				data: dt,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				beforeSend: function(){
					$( '#progress' ).html( 'File loading...' );
					$( '#imagepic' ).attr( 'src', source );
					$( '#imagepic' ).show( );
					alert( file.path )
				},
				success: function( data ){
					$( '#progress' ).html( 'Upload complete' );
				},
			});
			
			e.preventDefault();
			
		