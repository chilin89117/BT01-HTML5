$(document).ready(function () {
	var items = $('#gallery li')
	var itemsByTags = {};
		
	// Loop thru each '<li>' to group them by 'data-tags' attribute ----- 
	items.each(function (i) {
		var elem = $(this);
		
		// Get an array of categories by splitting comma-separated --------
		//			values in the 'data-tags' attribute of each li
		var tags = elem.data('tags').split(',');
		
		// Add 'data-id' attribute to item as required by Quicksand -------
		elem.attr('data-id',i);
		
		// Loop thru 'tags' array to extract each category ---------------- 
		$.each(tags, function(key, value){
			value = $.trim(value);

			// If the caterogy is not a key in 'itemByTags', ----------------
			//			create an empty array for that category
			if (!(value in itemsByTags)) {
				itemsByTags[value] = [];
			}
			// add the current 'li' element to the current category ---------
			itemsByTags[value].push(elem);
		});
	});
	
	// Create a list to contain all items regardless of category --------
	createList('All Items',items);
	
	// Create a list for each category using the same createList() ------ 
	$.each(itemsByTags, function (k, v) {
		createList(k, v);
	});
	
	// Click handler for the nav bar ------------------------------------
	$('#navbar a').on('click', function (e) {
		var link = $(this);

		// Add 'active' class to clicked link and remove 'active' ---------
		// class from its siblings
		link.addClass('active').siblings().removeClass('active');
		
		console.log(link.data('list'));		
		
		// use Quicksand to display list of li's where #gallery is
		// the source ul; destination ul will be created along 
		// with the menu item (see Quicksand documentation);
		// change animation duration from 750ms (default) to 500ms;
		// use Fancybox plugin as the callback function
		$('#gallery').quicksand(link.data('list').find('li'),
			{duration: 500}, function () {$(".fancybox").fancybox();}
		);
		e.preventDefault();
	});
	
	// Default: Select 1st item in nav bar to show 'All Items' ----------
	$('#navbar a:first').click();
	
	// Create list of li's by category from 'itemsByTags' object --------
	function createList (category, items) {
		
		// Create empty ul with a 'hidden' class styled in style.css; -----
		//			this is the destination ul for Quicksand
		var ul = $('<ul>', {'class':'hidden'});
		
		// Clone each item and append it to the end of ul object; ---------
		$.each(items, function () {
			$(this).clone().appendTo(ul)
		});
		
		// Append destination ul to source ul (see Quicksand docs) --------
		ul.appendTo('#gallery');
		
		// Create a menu item in the nav bar and pass ul object -----------
		//			as the data for Quicksand function above
		$('<a>', {
			html: category,
			href: '#',
			data: {list: ul}
		}).appendTo('#navbar');
	}
});