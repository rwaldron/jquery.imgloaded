/*
 * Special event for image load events
 * Needed because some browsers does not trigger the event on cached images.

 * MIT License
 * Paul Irish     | @paul_irish | www.paulirish.com
 * Andree Hansson | @peolanha   | www.andreehansson.se
 * 2010.
 *
 * Usage:
 * $(images).bind('load', function (e) {
 *   // Do stuff on load
 * });
 *
 * Note that you can bind the 'error' event on data uri images, this will trigger when
 * data uri images isn't supported.
 *
 * Tested in:
 * FF 3+
 * IE 6-8
 * Chromium 5-6
 * Opera 9-10
 */
(function ($) {
	$.event.special.load = {
		add: function (handleObj) {
			if (this.tagName.toLowerCase() === 'img' && this.src) {
				// Image is already complete, fire the hollaback (fixes browser issues were cached
				// images isn't triggering the load event)
				if (this.complete || this.readyState === 'complete') {
					// manually dispatch load event *only* on this handler
					// (existing handlers will have received load event normally)
					var event = new $.Event('load');
					event.currentTarget = event.target = this;
					event.data = handleObj.data;
					handleObj.handler.call(this, event);
				}

				// Check if data URI images is supported, fire 'error' event if not
				else if (this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0) {
					$(this).trigger('error');
				}
			}
		}
	};
}(jQuery));
