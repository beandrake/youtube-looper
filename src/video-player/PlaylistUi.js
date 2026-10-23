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


	// Updates playlistElement's innerHTML to represent the provided playlist
	updateWebpage(videoList) {
		// Generates HTML that we will insert within the playlist element
		let html = '';
		let count = 0
		for (let video of videoList) {
			html += `
				<input
					type="radio" name="${this.name}"
					id="playlist-${count}" value="${video.id}"
				>
				<label for="playlist-${count}">${video.title}</label><br>`;
			count++;
		}
		this.playlistElement.innerHTML = html;
	}
}

export default PlaylistUi;