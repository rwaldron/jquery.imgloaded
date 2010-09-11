/*
 * Special event for image load events
 * Needed because some browsers does not trigger the event on cached images.
 *
 * MIT License
 * Paul Irish     | @paul_irish | www.paulirish.com
 * Andree Hansson | @peolanha   | www.andreehansson.se
 * Colin Snover   | who uses twitter anyway | www.zetafleet.com
 * 2010.
 *
 * Usage:
 * $(images).bind('load', function (e) {
 *   // Do stuff on load
 * });
 *
 * Note that you can bind the 'error' event on data uri images; this will
 * trigger when data uris aren't supported.
 *
 * Tested in:
 * FF 3-4.0b5
 * IE 6-9PR4
 * Chrome 5-7
 * Opera 10.6
 */
(function ($) {
	$.event.special.load = {
		add: function (handleObj) {
			// nodeType is required to avoid conflicts with window.onload
			if (this.nodeType === 1 && this.tagName.toLowerCase() === 'img' && this.getAttribute('src')) {
				// Image is already loaded, fire the callback (fixes browser
				// issue where cached images don’t trigger the load event)
				if (this.readyState === 'complete') {
					var event = new $.Event('load');
					event.currentTarget = event.target = this;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					// the handler has to be pushed to the handler list in the
					// parent in case it tries to unbind itself, but that does
					// not happen until we return from special.add, so we defer
					// the callback so it executes after the push
					setTimeout(function () {
						handleObj.handler.call(event.target, event);
					}, 0);
				}
				// this breaks in IE8, somehow.
				/*else if (this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0) {
					$(this).trigger('error');
				}*/
			}
		}
	};
}(jQuery));

/*(function ($) {
	var uuid = 0,
		timeouts = {};

	$.event.special.load = {
		add: function (handleObj) {
			if (this.tagName.toLowerCase() === 'img' && this.getAttribute('src')) {
				var events = $.data(this, 'events');
				// Image is already complete, fire the hollaback (fixes browser issues were cached
				// images isn't triggering the load event)
				if (this.complete || this.readyState === 'complete') {
					// manually dispatch load event *only* on this handler
					// (existing handlers will have received load event normally)

					var oldHandler = handleObj.handler,
						currentUuid = ++uuid;

					// change the default handler for this load event to one
					// which will prevent our special event from running
					// should the browser fire its own load event on this bind
					handleObj.handler = function () {
						clearTimeout(timeouts[currentUuid]);
						delete timeouts[currentUuid];

						// restore original handler for future load events
						oldHandler.guid = handleObj.handler.guid;
						handleObj.handler = oldHandler;

						oldHandler.apply(this, arguments);
					};

					// this special load event ensures that at our load handler
					// is fired at least once even if the image has already
					// been loaded prior to being bound
					timeouts[currentUuid] = setTimeout(function () {
						var event = new $.Event('load');
						event.currentTarget = event.target = this;
						event.data = handleObj.data;
						event.handleObj = handleObj;

						// restore original handler for future load events
						oldHandler.guid = handleObj.handler.guid;
						handleObj.handler = oldHandler;

						delete timeouts[currentUuid];
						oldHandler.call(this, event);
					}, 15);
				}

				// Check if data URI images is supported, fire 'error' event if not
				else if (this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0) {
					$(this).trigger('error');
				}
			}
		}
	};
}(jQuery));*/
