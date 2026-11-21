/**
 * EventSystem
 * Publish and subscribe to custom events.
 */
class EventSystem {
	
	// A dictionary that contains:
	//	key = eventType
	//	value = array of callbacks to call when that event triggers
	static subDict = {};


	// Trigger an event that subscribers can react to.
	// @param event - something comparable that distinctly identifies your event
	// @param context - optional data to pass when the callback is invoked
	static publish(event, context=null) {
		var callbackList = EventSystem.subDict[event];
		if (callbackList == null) {
			// nobody is subscribed to this, we're done
			return;
		}

		// Invoke each callback.
		for (let callback of callbackList) {
			callback(context);
		}
	}


	// Subscribe to an event with a callback.
	// @param event - when this event happens, the callback will be called
	// @param callback - function to call when the event occurs
	static subscribe(event, callback){
		var callbackList = EventSystem.subDict[event];
		if (callbackList != null) {
			// Add this callback to the list of event responders.
			callbackList.push(callback);
		} else {
			// Nobody was subscribed to this...until now!
			EventSystem.subDict[event] = [callback];
		}
	}

	
	// Remove any subscriptions related to the pair of this event and callback.
	// @param event - the event 
	// @param callback - the callback
	// @return - the number of subscriptions removed
	static unsubscribe(event, callback){
		var callbackList = EventSystem.subDict[event];
		if (callbackList == null) {
			// nobody is subscribed to this, we're done
			return;
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
}

export default EventSystem;