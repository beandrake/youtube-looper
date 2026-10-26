import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
/**
 * PlaylistData
 * Manages the data for playlist records (pairs of titles and YouTube IDs).
 */
class PlaylistData {
	// @param playlistId - id of element to insert playlist in via innerHTML
	// @param playlistUi - PlaylistUi to send updates to
	constructor(playlistId, playlistUi) {
		this.playlistUi = playlistUi;
		this.videoList = [];
	}

	// Empties playlist
	clearAll() {
		this.videoList = [];
		this._updateUi();
	}

	// Add a video to the end of the list and update webpage.
	appendVideo(title, id) {
		this._appendVideo(title, id);
		let selectedIndex = this.playlistUi.getSelectedVideoIndex();
		this._updateUi(selectedIndex);
	}

	// Add a video to the end of the list.
	_appendVideo(title, id) {
		var video = { title: title, id: id };
		this.videoList.push(video);
	}

	// Remove a video from the list and update webpage.
	removeVideo(index) {
		this._removeVideo(index);
		this._updateUi();
	}

	// Remove a video from the list.
	_removeVideo(index) {
		this._validateIndex(index);
		this.videoList.splice(index, 1);
	}

	// Shift video 1 index earlier.
	// @param index - index of video to move
	// @param underflow - if given index 0, false will not move the video,
	//                    while true will move it to the end.
	shiftVideoEarlier(index, underflow=true) {
		this._validateIndex(index);

		if (index > 0) {
			// swap video with the one before it
			let targetVideo = this.videoList[index];
			this.videoList[index] = this.videoList[index-1];
			this.videoList[index-1] = targetVideo;
			// update UI and keep this element selected
			this._updateUi(index-1);
		} else if (underflow) {
			// put at the end of the list
			let targetVideo = this.videoList[index];
			this._removeVideo(index);
			this._appendVideo(targetVideo.title, targetVideo.id);
			// update UI and keep this element selected
			this._updateUi(this.videoList.length-1);
		}
	}

	// Shift video 1 index later.
	// @param index - index of video to move
	// @param overflow - if given max index, false will not move the video,
	//                   while true will move it to the beginning.
	shiftVideoLater(index, overflow=true) {
		this._validateIndex(index);

		if (index < this.videoList.length-1) {
			// swap video with the one after it
			let targetVideo = this.videoList[index];
			this.videoList[index] = this.videoList[index+1];
			this.videoList[index+1] = targetVideo;
			// update UI and keep this element selected
			this._updateUi(index+1);
		} else if (overflow) {
			// put at the start of the list
			let targetVideo = this.videoList[index];
			this._removeVideo(index);
			this.videoList.unshift(targetVideo);
			// update UI and keep this element selected
			this._updateUi(0);
		}
	}

	// throws an error if index is out of range
	_validateIndex(index) {
		if (index < 0 || index >= this.videoList.length) {
			throw new RangeError("Invalid index.");
		}
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
	// @param selectedIndex (optional) - index of video to set as selected
	_updateUi(selectedIndex = null) {		
		this.playlistUi.updateWebpage( this.getVideoList(), selectedIndex );
	}

	// Load a playlist from a pair data file; clears the previous playlist
	// @param source - file on the web containing playlist data
	async loadFromWebFile(source) {
		var stringData = await FileOps.loadFromWebFile(source);
		var dataList = PairData.arrayFromString(stringData);
		this.loadFromArray(dataList);

		return true;
	}

	// Load playlist from array; clears the previous playlist
	// @param list - an array of 2-dimensional arrays containing titles and IDs
	loadFromArray(list) {
		var backupList = this.videoList;
		this.videoList = [];

		try {
			for (let pair of list) {
				this._appendVideo( pair[0], pair[1] );
			}
		} catch (error) {
			this.videoList = backupList;
			throw error;
		}
		this._updateUi();
	}
}

export default PlaylistData;