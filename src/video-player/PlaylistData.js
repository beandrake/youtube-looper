import PairDataSet from './../utils/PairDataSet.js';
/**
 * PlaylistData
 * Manages the data for playlist records (pairs of titles and YouTube IDs).
 */
class PlaylistData {
	// @param playlistId - id of element to insert playlist in via innerHTML
	// @param playlistUi - PlaylistUi to send updates to
	// @param errorUi - ErrorUi to send errors to
	constructor(playlistId, playlistUi, errorUi) {
		this.playlistUi = playlistUi;
		this.errorUi = errorUi;

		this.videoList = [];
	}

	// Empties playlist
	clearAll() {
		this.videoList = [];
	}

	// Add a video to the end of the list and update webpage
	appendVideo(title, id) {
		this._appendVideo(title, id);
		this._updateUi();
	}

	// Add a video to the end of the list
	_appendVideo(title, id) {
		var video = { title: title, id: id };
		this.videoList.push(video);
	}

	// Provides a deep copy of the video list
	// @param onlyArrays - set to true to receive as an array of 2D arrays
	getVideoList(onlyArrays=false) {
		let copyOfList = [];
		for (let video of this.videoList) {
			let newVideo;
			if (onlyArrays) {
				newVideo = [video.title, video.id];
			} else {
				newVideo = { title: video.title, id: video.id };
			}
			copyOfList.push(newVideo);
		}
		return copyOfList;
	}

	// Gives the playlist UI the updated playlist to display
	_updateUi() {		
		this.playlistUi.updateWebpage( this.getVideoList() );
	}

	// Load a playlist from a pair data file; clears the previous playlist
	loadFromFile(source) {
		var arrayPromise = PairDataSet.loadFromFile(source);
		arrayPromise.catch( error => this.errorUi.displayError(error) )
			.then( data => this.loadFromArray(data) );
	}

	// Load playlist from array; clears the previous playlist
	loadFromArray(list) {
		this.clearAll();

		// expects an array of 2-dimensional arrays, containing title and ID
		try {
			for (let pair of list) {
				this._appendVideo( pair[0], pair[1] );
			}
		} catch (error) {
			var customErrorMessage = "Problem loading playlist from array.";
			this.errorUi.displayError(error, customErrorMessage);
		}
		this._updateUi();
	}
}

export default PlaylistData;