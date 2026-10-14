import trimOuterWhiteSpace from './textUtilities.js';
/**
 * FileOps
 */
var FileOps = new function() {

	// Returns a promise for the file data in string format
	// @param source - path to load data from
	this.loadFromWebFile = function(source) {	
		return fetch(source)
			.then( response => response.text() );
	}
	
	// Given an array of 2-item arrays, save locally to a file
	// @param stringData - data to write to the file
	// @param filename - filename to save locally
	this.saveToFile = function(stringData, filename) {		
		// create file-like object based on string data
		var blobData = new Blob( [stringData], { type: "text/plain" } );
		var url = URL.createObjectURL(blobData);
		
		// make a hyperlink element which is not actually attached to the page
		var tempElement = document.createElement("a");
		tempElement.download = filename;
		tempElement.href = url;

		// click the hyperlink, which downloads a local copy of the file
		tempElement.click();
	}
}

export default FileOps;