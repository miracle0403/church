
/*
form.on('fileBegin', function(name, file) {
						var newpath =  '/Users/STAIN/desktop/sites/obionyi/public/images/samples/' + file.name;
						var oldpath  =  file.path;
						var type  =  file.type;
						var size  =  file.size;
						var oldfile  =  path.basename(oldpath);
						//console.log(newfile + 'is the new file');
						//change the file name
						console.log(newpath);
						//if the type is not supported.
						var supported  =  {
							png: 'image/png',
							jpg: 'image/jpg',
							jpeg: 'image/jpeg'
						}
						if( type  == supported.png || type == supported.jpg || type == supported.jpeg){
							//console.log( 'file is supported', typeof supported.jpeg, typeof type, supported.jpeg === type, supported.jpeg == type);
							//check the size
							if( size > 3000000 ){
								var error = 'This file is too big. the maximum file size is 3mb.'
								//console.log( 'file too big' )
								//delete the file
								fs.unlink('oldpath', function(err){
									if(err) throw err;
									res.render('upload', {title: 'FILE UPLOAD FAILED', error: error});
								});
							}else{
								
								// move the file.
								fs.rename(oldpath, newpath, function( err ){
									if( err ) throw err;
									console.log( 'file moved' );
									securePin.generatePin(10, function(pin){
										//insert joor
										var product_id = pin;
										db.query('INSERT INTO products (price, category, product_name, image, product_id, status) values (?, ?, ?, ?, ?, ?)', [price, category, product, newpath, product_id, 'instock'], function(err, results, fields){
											if (err) throw err;
											var success = 'Product added successfully';
											res.render('upload', {title: 'FILE UPLOAD SUCCESSFUL', success: success});
										});
									});
								});
							}
						}else{
							//console.log( 'is not supported' );
							var error = 'This file is not supported. Use a jpg or png or jpeg file.';
							res.render('upload', {title: 'FILE UPLOAD FAILED', error: error});
						}
					});
					*/