import YouTubeOps from './../utils/YouTubeOps.js';
import Listener from './common/Listener.js';

/**
 * PlaylistUi
 * Manages the Playlist UI.
 */
class PlaylistUi {
	// @param videoFrameId - id of iframe element containing videos
	// @param playlistId - id of element which will contain playlist entries
	// @param playlistData - PlaylistData to translate into a view
	// @param errorUi - ErrorUi to send errors to	
	constructor(videoFrameId, playlistId, playlistData, errorUi) {
		this.videoFrame = document.getElementById(videoFrameId);
		this.playlistElement = document.getElementById(playlistId);
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.groupName = "video-option";
		
		// setup so when any radio button is clicked, loadVideo gets called
		const callback = (event) => this.loadVideo(event.target.value);
		this.radioListener = new Listener(playlistId, callback, 'change');

		this._subscribeToData();
	}

	// Whenever PlaylistData is updated, have it tell us to update the webpage.
	_subscribeToData() {
		const callback = () => this.updateWebpage();
		this.playlistData.addSubscriber(callback);
	}

	// Replaces the YouTube video in the iframe with the user's selection
	loadVideo(youtubeId) {
		// create new looping embedded URL for iframe and apply it to the iframe
		const newSource = YouTubeOps.generateLoopingUrl(youtubeId);
		this.videoFrame.src = newSource;
	}

	// Returns index of video that is currently selected, or null if none
	getSelectedVideoIndex() {
		// get element radio button that is currently checked
		const element = document.querySelector(`input[name=${this.groupName}]:checked`);
		if (element == null) {
			return null;
		}

		const [index, id] = this._extractDataFromElementId(element.id);
		return index;
	}

	// Returns id of video that is currently selected, or null if none
	getSelectedVideoId() {
		// get element radio button that is currently checked
		const element = document.querySelector(`input[name=${this.groupName}]:checked`);
		if (element == null) {
			return null;
		}
		
		const [index, id] = this._extractDataFromElementId(element.id);
		return id;
	}

	// We store information relevant to the video in the element's id,
	// using hyphens (-) as delimiters.  Example: playlist-3-101
	//	The first numerical value is the video's index.
	//	The second numerical value is the video's id from PlaylistData.
	_generateElementId(index, id) {
		return `playlist-${index}-${id}`;
	}

	_extractDataFromElementId(elementId) {
		const [, index, id] = elementId.split("-");
		return [Number(index), Number(id)];
	}


	// Updates playlistElement's innerHTML to represent PlaylistData
	updateWebpage() {
		// record selection so we can select it again, if it still exists
		const selectionId = this.getSelectedVideoId();
		
		const videoList = this.playlistData.getVideoList();
		
		// Generates HTML that we will insert within the playlist HTML element
		let html = '';
		let index = 0
		for (let video of videoList) {
			const checked = (video.id == selectionId) ? `checked="X"` : '';
			let elementId = this._generateElementId(index, video.id);
			html += `
				<input
					type="radio" name="${this.groupName}"
					id="${elementId}" value="${video.youtubeId}"
					${checked}
				>
				<label for="${elementId}">${video.title}</label><br>`;
			index++;
		}
		this.playlistElement.innerHTML = html;
	}
}

export default PlaylistUi;