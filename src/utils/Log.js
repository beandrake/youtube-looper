
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
			this.getFormattedTimestamp(),
			separator,
			message
		);
		console.log( pieces.join("") );
	}
	

	// Returns a string representation of the current time,
	// with leading/trailing zeroes so that timestamps align.
	// Formatted as HH:MM:SS.sss
	// @param milliseconds (default: true) - include milliseconds if true
	this.getFormattedTimestamp = function(milliseconds=true) {
		
		function numberFormat(value, digits) {
			var numString = "00" + value;
			return numString.substr(numString.length - digits);
		}

		const now = new Date();		
		const pieces = [];
		pieces.push(
			numberFormat(now.getHours(), 2),
			":",
			numberFormat(now.getMinutes(), 2),
			":",
			numberFormat(now.getSeconds(), 2),
			milliseconds ? "." : "",
			milliseconds ? numberFormat(now.getMilliseconds(), 3) : ""
		);

		return pieces.join("");
	}

}

export default Log;