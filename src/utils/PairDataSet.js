import trimOuterWhiteSpace from './textUtilities.js';
/**
 * PairDataSet
 * Contains functions to save and load files containing pair data.
 * Formatting rules:
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

	// Returns a promise for an array of 2-dimensional arrays
	this.loadFromFile = function(source) {	
		return fetch(source)
			.then( response => response.text() )
			.then( data => this._loadFromData(data)	);
	}

	// Returns an array of 2-dimensional arrays
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

	this.saveToFile = function(data, destination) {
		// implement me
	}
}

export default PairDataSet;