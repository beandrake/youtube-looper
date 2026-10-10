/**
 * PlaylistUi
 * Manages the Playlist UI.
 */
class PlaylistUi {
	constructor(videoFrameId, playlistId, errorUi) {
		this.videoFrame = document.getElementById(videoFrameId);
		this.playlistElement = document.getElementById(playlistId);
		this.errorUi = errorUi;

		this.name = "video-option";
		this.startLoadVideoListener();
	}

	// replaces the YouTube video in the iframe with the user's selection
	loadVideo(videoId) {
		// create new looping embedded URL for iframe and apply it to the iframe
		const newSource = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}&loop=1`;
		this.videoFrame.src = newSource;
	}


	// this makes it so loadVideo gets called when we click any radio button
	startLoadVideoListener() {
		var self = this;
		this.playlistElement.addEventListener(
			'change',
			(event) => {
				const matchListedVideo = `input[name="${self.name}"]`;
				if ( event.target.matches(matchListedVideo) ) {
					self.loadVideo(event.target.value);
				}
			}
		);
	}

	// updates playlistElement's innerHTML to represent the provided playlist
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