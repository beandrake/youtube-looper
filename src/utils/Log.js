import TimeOps from './TimeOps.js';
/**
 * Log
 * Contains utility functions related to logging.
 */
var Log = new function() {

	// Logs a message with a leading timestamp to the console.  Timestamp
	// uses leading/trailing zeroes so that timestamps align.
	// @param message - whatever you want to log
	// @separator - text to go between the timestamp and your message, default
	//              is a hyphen with one space on each side
	this.toConsole = function(message, separator=" - ") {
		const pieces = [];
		pieces.push(
			TimeOps.getFormattedTimestamp(),
			separator,
			message
		);
		console.log( pieces.join("") );
	}
}

export default Log;