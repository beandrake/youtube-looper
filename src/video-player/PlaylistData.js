import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
/**
 * PlaylistData
 * Manages the data for playlist records (pairs of titles and YouTube IDs).
 */
class PlaylistData {
	constructor() {
		this.videoList = [];
		this.nextId = 100;
		this.subscriberCallbacks = [];
	}

	// Provide a function to call when this object's data gets updated.
	addSubscriber(callback) {
		this.subscriberCallbacks.push(callback);
	}
	
	// When adding a new item to the list, this generates a distinct id.
	_assignNewId() {
		return this.nextId++;
	}

	// Empties playlist and considers data updated.
	clearAll() {
		this.videoList = [];
		this._considerMeUpdated();
	}

	// Add a video to the end of the list and consider data updated.
	appendVideo(title, youtubeId) {
		this._appendVideo(title, youtubeId);
		this._considerMeUpdated();
	}

	// Add a video to the end of the list.
	_appendVideo(title, youtubeId) {
		var video = {
			id: this._assignNewId(),
			title: title,
			youtubeId: youtubeId
		};
		this.videoList.push(video);
	}

	// Remove a video from the list and consider data updated.
	removeVideo(index) {
		this._removeVideo(index);
		this._considerMeUpdated();
	}

	// Remove a video from the list.
	_removeVideo(index) {
		this._validateIndex(index);
		this.videoList.splice(index, 1);
	}

	// Update a video's title and consider data updated.
	updateTitle(index, title) {
		this.videoList[index].title = title;
		this._considerMeUpdated();
	}

	// Shift video 1 index earlier and consider data updated.
	// @param index - index of video to move
	// @param underflow - if video is at the start of list, false will not move
	//                     the video, while true will move it to the end.
	shiftVideoEarlier(index, underflow=true) {
		this._validateIndex(index);

		if (index > 0) {
			// swap video with the one before it
			let targetVideo = this.videoList[index];
			this.videoList[index] = this.videoList[index-1];
			this.videoList[index-1] = targetVideo;
		} else if (underflow) {
			// put at the end of the list
			let targetVideo = this.videoList[index];
			this._removeVideo(index);
			this.videoList.push(targetVideo);
		}
		this._considerMeUpdated();
	}

	// Shift video 1 index later and consider data updated.
	// @param index - index of video to move
	// @param overflow - if video is at the end of list, false will not move
	//                   the video, while true will move it to the start.
	shiftVideoLater(index, overflow=true) {
		this._validateIndex(index);

		if (index < this.videoList.length-1) {
			// swap video with the one after it
			let targetVideo = this.videoList[index];
			this.videoList[index] = this.videoList[index+1];
			this.videoList[index+1] = targetVideo;
		} else if (overflow) {
			// put at the start of the list
			let targetVideo = this.videoList[index];
			this._removeVideo(index);
			this.videoList.unshift(targetVideo);
		}
		this._considerMeUpdated();
	}

	// throws an error if index is out of range
	_validateIndex(index) {
		if (index < 0 || index >= this.videoList.length) {
			throw new RangeError("Invalid index.");
		}
	}

	// Provides a deep copy of the video list.
	getVideoList() {
		let copyOfList = [];
		for (let video of this.videoList) {
			let newVideo = {
				id: video.id,
				title: video.title,
				youtubeId: video.youtubeId
			};
			copyOfList.push(newVideo);
		}
		return copyOfList;
	}

	// Triggers data update stuff
	_considerMeUpdated() {
		for (let callback of this.subscriberCallbacks) {
			callback( this.getVideoList() );
		}
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
		this._considerMeUpdated();
	}
}

export default PlaylistData;