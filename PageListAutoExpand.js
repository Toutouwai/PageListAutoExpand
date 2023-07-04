$(document).ready(function() {

	const delay = ProcessWire.config.PageListAutoExpand.delay;
	let t;

	// Refresh jQuery UI Sortable
	function refreshSortable() {
		// Add list placeholder to open items so that nested sorting is possible
		// This is mostly based on code in ProcessPageList.js
		$('.PageListItemOpen').each(function() {
			// Return early if PageListPlaceholder is already added
			if($(this).next().hasClass('PageListPlaceholder')) return;
			// If there are children and the next sibling doesn't contain a visible .PageList, then don't add a placeholder
			var numChildren = parseInt($(this).attr('data-numchild'));
			if(numChildren > 1 && $(this).next().find(".PageList:visible").length === 0) return;
			var $ul = $('<div></div>').addClass('PageListPlaceholder').addClass('PageList');
			$ul.append($('<div></div>').addClass('PageListItem PageListPlaceholderItem').html('&nbsp;'));
			$(this).after($ul);
		});
		$('.PageListSortingList').sortable('refresh');
	}

	// Load children of next page adjacent to Sortable placeholder
	function loadChildrenOnHover() {
		const $root = $('.PageListRoot');
		const $placeholder = $('.PageListSortPlaceholder');
		const $next = $placeholder.next();
		// Trigger click on next item to expand it
		if(!$next.hasClass('PageListItemOpen')) {
			// Temporarily remove PageListSorting class to prevent ProcessPageList from blocking click events
			$root.removeClass('PageListSorting');
			$next.find('a.PageListPage').trigger('click');
			$root.addClass('PageListSorting');
		}
		// Refresh sortable
		refreshSortable();
		// If any children are loaded call refreshSortable()
		$(document).on('pageListChildrenDone',  refreshSortable);
	}

	// When move button clicked (core prevents event handler on "click")
	$(document).on('mousedown', '.PageListActionMove a', function() {
		// When sort position changes
		$('.PageList .PageList').on( 'sortstart sortchange', function(event, ui) {
			clearTimeout(t);
			t = setTimeout(loadChildrenOnHover, delay);
			// When sorting is finished
			$('.PageList .PageList').on('sortbeforestop', function(event, ui) {
				// Clear timeout so that loadChildrenOnHover() won't fire
				clearTimeout(t);
				// Remove event handler that calls refreshSortable() after children are loaded
				$(document).off('pageListChildrenDone', refreshSortable);
			});
		});
	});

});
