import TimeOps from './../utils/TimeOps.js';
import Log from './../utils/Log.js';
/**
 * EventSystem
 * Publish and subscribe to custom events.
 * 
 * Note that EventSystem is not asynchronous. When an event is "published"
 * using the publish function, the publish function directly invokes any
 * callbacks associated with the event, in sequence, before then returning
 * from publish() to whatever called it.
 * 
 * Events are objects that contain some metadata about the type of event
 * and the time the event was created; if they were given any other relevant
 * data, that will live nested within the event's details object.
 * This implementation leaves it up to the user to determine what exactly
 * an event's type (eventType) is, so long as it is able to be compared.
 */
class EventSystem {
	
	// A dictionary that contains:
	//	key = eventType
	//	value = array of callbacks to call when that event triggers
	static subDict = {};


	// Trigger an event that subscribers can react to.
	// @param eventType - the type of event
	// @param details (optional) - an object containing any relevant data
	static publish(eventType, details=null) {
		var callbackList = EventSystem.subDict[eventType];
		if (callbackList == null) {
			// nobody is subscribed to this, we're done
			return;
		}

		// create event
		var event = {};
		event.type = eventType;
		event.created = TimeOps.getFormattedTimestamp();
		event.details = details;

		// Invoke each callback.
		for (let callback of callbackList) {
			callback(event);
		}
	}


	// Subscribe to an event with a callback.
	// @param eventType - eventType to react to
	// @param callback - function to call when the event occurs
	static subscribe(eventType, callback){
		var callbackList = EventSystem.subDict[eventType];
		if (callbackList != null) {
			// Add this callback to the list of event responders.
			callbackList.push(callback);
		} else {
			// Nobody was subscribed to this...until now!
			EventSystem.subDict[eventType] = [callback];
		}
	}

	
	// Remove any subscriptions related to the pair of this event and callback.
	// @param eventType - eventType used to subscribe
	// @param callback - callback used to subscribe
	// @return - the number of subscriptions removed
	static unsubscribe(eventType, callback){
		var callbackList = EventSystem.subDict[eventType];
		if (callbackList == null) {
			// nobody is subscribed to this, we're done
			return 0;
		}

		// Remove all instances of the callback associated with this event.
		var removed = 0;
		var index = callbackList.indexOf(callback);
		while (index > -1) {
			// Removes this one item.
			callbackList.splice(index, 1);
			removed += 1;
			// Check if there are any remaining copies.
			index = callbackList.indexOf(callback);
		}

		return removed;
	}

	
	// A shortcut for publishing errors, since this is a common operation.
	// @param error - either an Error object or a string error message
	static publishError(error) {
		const details = {};
		if (error instanceof Error) {
			details.errorObject = error;
			details.errorMessage = error.message;
		} else {
			details.errorMessage = error;
		}

		EventSystem.publish("error", details);
	}

}

export default EventSystem;