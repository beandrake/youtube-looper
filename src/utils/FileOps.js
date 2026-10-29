import TextOps from './TextOps.js';
/**
 * FileOps
 * Contains functions related to loading and saving files.
 */
var FileOps = new function() {

	// Returns a promise for the file data in string format
	// @param source - path to load data from
	this.loadFromWebFile = function(source) {	
		return fetch(source)
			.then(
				 response => {						
					if (!response.ok) {
						throw new Error(`When loading file received HTTP status ${response.status}.`);
					}
					return response.text();
				}
			);
	}

	// Returns a promise for a string containing the contents of the file in
	// an HTML element, such as <input type="file">.
	// @param element - an element with a file
	this.loadFromInputFileElement = async function (element) {
		if (element.files.length === 0) {
			throw new Error("Can't load file, no file selected.");
		}

		var file = element.files[0];
		if ( !file.type.startsWith("text") ) {
			throw new Error("Unsupported file type, must be a text file.");
		}

		// FileReader is async, so wrap it in a promise and wait for resolution
		var fileContents = await new Promise(
			(resolve) => {
				const fileReader = new FileReader();
				fileReader.onload = (e) => resolve(fileReader.result);
				fileReader.onerror = (e) => reject(e);
				fileReader.readAsText(file);
			}
		);
		
		return fileContents;
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