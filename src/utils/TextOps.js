/**
 * TextOps
 * Contains functions related to handling text.
 */
var TextOps = new function() {

	// Given a string, returns a version without leading or trailing white space.
	this.trimOuterWhiteSpace = function(text) {
		return text.replace(/^\s+/, '').replace(/\s+$/, '');
	}
	
}

export default TextOps;