
				xhr: function(){
					var xhr: new window.XMLHttpRequest();
					xhr.upload.addEventListener( "progress", function ( evt ){
						if( evt.lengthComputable ){
							var percentComplete = evt.loaded/evt.total;
							$( '.progress' ).css({
								width: percentComplete * 100 + '%';
							});
							if( percentComplete === 1 ){
								$( '.progress' ).addClass( 'hide' );
								
							}
						}
					});
				}
