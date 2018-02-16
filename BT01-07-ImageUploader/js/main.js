$(function(){
	// div id in main element
	var picbox = $('#picbox');
	
	// span class in main element for background image	
	var back = $('.back');
	
	// jQuery plugin from https://github.com/weixiyen/jquery-filedrop		
	picbox.filedrop({
		paramname:'pic',
		allowedfiletypes: ['image/jpeg', 'image/png', 'image/gif'],
		allowedfileextensions: ['.jpg', '.jpeg', '.png', '.gif'],
		maxfilesize: 2,
		maxfiles: 2,
		url: 'upload.php',
		
		// error handler from plugin documentation
		error: function (err, file) {
			switch(err) {
				case 'BrowserNotSupported':
					alert("Your browser does not support HTML5 drag and drop.")
					break;
				case 'TooManyFiles':
					alert("You have exceeded number of files in 'maxfiles' parameter.");
					break;
				case 'FileTooLarge':
					alert(file.name + 
						" is larger than size specified in 'maxfilesize' parameter.");
					break;
				case 'FileTypeNotAllowed':
					alert(file.name +
						" is not in the specified list 'allowedfiletypes' parameter.");
					break;
				case 'FileExtensionNotAllowed':
					alert(file.name +
						" is not in the specified list 'allowedfileextensions' parameter.");
					break;
				default:
					break;
			}
    },
		
		// use createImage() to show image
		uploadStarted: function(i, file, len) {
			createImage(file);
		},
		
		// function to intermittently update progress
		progressUpdated: function(i, file, progressPct){
			$.data(file).find('.progressBar').width(progressPct);
		},
		
		// when upload is finished, add 'done' class to the template which
		// was associated with the file by the createImage() function
		uploadFinished: function (i, file, response) {
			$.data(file).addClass('done');
			
			/* this statement is not necessary because, when 'done' class
				 is added, css will display .uploaded (see main.css)
			$('.uploaded').show();
			*/
		}
	});
	
	// build HTML template for holding images, including .uploaded
	// class for check mark, and a progress bar
	var template = '<div class="preview">' +
										'<span class="imageHolder">' +
											'<span class="uploaded"></span>'+
											'<img>' +
										'</span>' +
										'<div class="progressHolder">' +
											'<div class="progressBar"></div>' +
										'</div>' +
										'<div class="status"></div>' + 
								 '</div>';	
		
	function createImage(file){
		
		// HTML for .preview div
		var preview = $(template);
		
		// img element inside preview
		var image = $('img', preview);
				
		// a new JS FileReader object to read the image file
		var reader = new FileReader();
		
		// create event handler to set the src attribute of img element
		// when file reading by readAsDataURL() is completed	
		reader.onload = function (e) {
			image.attr('src', reader.result);
		};
		
		// start reading the file; when finished, the result attribute
		// contains a data:URL for reader.onload event
		reader.readAsDataURL(file);

		// hide the background image and add preview div to the main div
		back.hide();
		preview.appendTo(picbox);
		
		// associate preview template with the file so uploadFinished
		// function can add 'done' class to the template
		$.data(file, preview);
	}
	
	/* not used ???
	function showMessage(msg){
		back.html(msg);
	}
	*/
});