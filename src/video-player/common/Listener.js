/**
 * Listener
 * A streamlined way to create simple listeners.
 * Starts and stops listening for specified events on specified elements,
 * and calls a function
 */
class Listener {
	// @param element - element or element id for an element to listen to
	// @param callback - a function to call when a desired event occurs
	// @param eventTypes (optional) - one or more events the listener should
	//                                react to, in the form of a string or an
	//                                array of strings; defaults to ['click']
	constructor(element, callback, eventTypes=['click']) {
		// if provided with the id of an element, retrieve the element
		if (typeof element === 'string' || element instanceof String) {
			this.element = document.getElementById(element);	
		} else {
			this.element = element;
		}

		// if eventTypes is just a single string, pack it into an array
		if (typeof element === 'string' || element instanceof String) {
			this.eventTypes = [eventTypes];
		} else {
			this.eventTypes = eventTypes;
		}

		this.callback = callback;		

		this.reactionFunction = (eventObject) => this.callback(eventObject);
		this.startListening();
	}

	// Start listening for the desired events.
	startListening() {
		this.eventTypes.forEach(
			event => this.element.addEventListener(
				event,
				this.reactionFunction
			)
		);
	}

	// If you're done with the button, get rid of the listeners.
	stopListening() {
		this.eventTypes.forEach(
			event => this.element.removeEventListener(
				event,
				this.reactionFunction
			)
		);
	}	
}

export default Listener;
