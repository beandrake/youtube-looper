import trimOuterWhiteSpace from './textUtilities.js';
/**
 * PairDataSet
 * Contains functions to save and load files containing pair data.
 * Pair data is considered to be any set of data where each item in the data
 * set is comprised of two values (hence, a pair).
 * Pair data loaded from files is formatted as an array of 2-length arrays,
 * and such an array is what functions saving pair data except as an argument.
 * File formatting rules:
 *  - Any line that is only white space is ignored.
 *  - The total number of non-white space lines must be divisible by 2.
 *  - Leading and trailing white space is ignored.
 * The white space rules are lax to enable custom organization.
 * Example:
 * 		Bob Susanson
 * 		Herbicide Specialist
 * 
 * 		Susan Boblinda
 * 		Martial Arts Instructor
 */
var PairDataSet = new function() {

	// Returns a promise for an array of 2-length arrays
	// @param source - path to load data from
	this.loadFromFile = function(source) {	
		return fetch(source)
			.then( response => response.text() )
			.then( data => this._loadFromData(data)	);
	}

	// Returns an array of 2-length arrays
	// @param data - a PairData-compatible string
	this._loadFromData = function(data) {
		// parse line by line; lines will be in pairs, a title followed by an id
		const lineList = data.split('\n');
	
		// Data format: lines are in pairs, white space lines are not counted
		var pairList = [];		
		var pair = []; 
		for (let index = 0; index < lineList.length; index++) {
			// strip any surrounding white space
			let line = trimOuterWhiteSpace( lineList[index] );
			// skip over empty lines
			if (line === '') {
				continue;
			}
			
			pair.push(line);
			if (pair.length == 2) {
				pairList.push(pair);
				pair = [];
			}
		}

		// if the file ended with an incomplete pair, error
		if (pair.length == 1) {
			throw new Error("While loading pairs from data, data ended mid-pair!");
		}
		return pairList;
	}

	// Given an array of 2-length arrays, returns a string representation
	// @param list - an array of 2-length arrays
	this.convertToString = function(list) {
		var myString = "";
		for (let sublist of list) {
			var first = sublist[0];
			var second = sublist[1];
			myString += first + '\n' + second + '\n\n';
		}
		return myString;
	}
	
	// Given an array of 2-length arrays, save locally to a file
	// @param list - an array of 2-length arrays
	// @param filename - filename to save locally
	this.saveToFile = function(list, filename) {
		var stringData = this.convertToString(list);
		
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

export default PairDataSet;