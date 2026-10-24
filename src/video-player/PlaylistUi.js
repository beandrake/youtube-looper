import YouTubeOps from './../utils/YouTubeOps.js';
/**
 * PlaylistUi
 * Manages the Playlist UI.
 */
class PlaylistUi {
	// @param videoFrameId - id of iframe element containing videos
	// @param playlistId - id of element which will contain playlist entries
	// @param errorUi - ErrorUi to send errors to	
	constructor(videoFrameId, playlistId, errorUi) {
		this.videoFrame = document.getElementById(videoFrameId);
		this.playlistElement = document.getElementById(playlistId);
		this.errorUi = errorUi;

		this.name = "video-option";
		this.startLoadVideoListener();
	}

	// Replaces the YouTube video in the iframe with the user's selection
	loadVideo(videoId) {
		// create new looping embedded URL for iframe and apply it to the iframe
		const newSource = YouTubeOps.generateLoopingUrl(videoId);
		this.videoFrame.src = newSource;
	}


	// This makes it so loadVideo gets called when we click any radio button
	startLoadVideoListener() {
		var self = this;
		this.playlistElement.addEventListener(
			'change',
			(event) => {
				self.loadVideo(event.target.value);
			}
		);
	}

	// Returns the id of the video that is currently selected, or null if none
	getSelectedVideoIndex() {
		// get element radio button that is currently checked
		const element = document.querySelector(`input[name=${this.name}]:checked`);

		if (element == null) {
			return null;
		}
		
		// element's id (not the video id) contains its index in the list
		//	Example id: playlist-3
		const [, index] = element.id.split("-");
		return Number(index);
	}

	// Updates playlistElement's innerHTML to represent the provided playlist
	// param @videoList - a list of objects with id and title members
	// param @checkedIndex (optional) - index of video to set as checked/selected
	updateWebpage(videoList, checkedIndex = null) {
		// Generates HTML that we will insert within the playlist element
		let html = '';
		let index = 0
		for (let video of videoList) {
			const checked = index == checkedIndex ? `checked="X"` : '';			
			html += `
				<input
					type="radio" name="${this.name}"
					id="playlist-${index}" value="${video.id}"
					${checked}
				>
				<label for="playlist-${index}">${video.title}</label><br>`;
			index++;
		}
		this.playlistElement.innerHTML = html;
	}
}

export default PlaylistUi;