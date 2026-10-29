import TextOps from './TextOps.js';
/**
 * PairData
 * Contains functions to save and load pair data. Conceptually, pair data
 * is a set of data where each item in the data set is comprised of two values
 * (hence, a pair).
 * 
 * These functions convert pair data between two different formats:
 *  - An array of 2-item arrays
 *  - A string or text file
 * 
 * A file or string containing pair data is expected to follow these
 * formatting rules:
 *  - Any line that is only white space is ignored.
 *  - The total number of non-white space lines must be divisible by 2.
 *  - Leading and trailing white space is ignored.
 * The white space rules are lax to enable human modification and organization,
 * but functions outputting pair data strings will add an extra line between
 * each pair for the sake of human readability.
 * 
 * Example:
 * 		Bob Susanson
 * 		Herbicide Specialist
 * 
 * 		Susan Boblinda
 * 		Martial Arts Instructor 
 */
var PairData = new function() {

	// Returns an array of 2-item arrays
	// @param data - a PairData-compatible string
	this.arrayFromString = function(dataString) {
		// parse line by line; lines will be in pairs, a title followed by an id
		const lineList = dataString.split('\n');
	
		// Data format: lines are in pairs, white space lines are not counted
		var pairList = [];		
		var pair = []; 
		for (let index = 0; index < lineList.length; index++) {
			// strip any surrounding white space
			let line = TextOps.trimOuterWhiteSpace( lineList[index] );
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

	// Given an array of 2-item arrays, returns a string representation
	// @param list - an array of 2-item arrays
	this.stringFromArray = function(list) {
		var myString = "";
		for (let sublist of list) {
			var first = sublist[0];
			var second = sublist[1];
			myString += first + '\n' + second + '\n\n';
		}
		return myString;
	}
}

export default PairData;