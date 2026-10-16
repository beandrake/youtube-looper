import trimOuterWhiteSpace from './../utils/textUtilities.js';
/**
 * AddVideoUi
 * The interface that adds a new video to a PlaylistUi.
 * Controls two text inputs (one for title, one for YouTube URL) and
 * a submission button.
 */
class AddVideoUi {
	// @param titleId - id for a text input element.
	// @param urlId - id for a text input element.
	// @param buttonId - the id for a button element
	// @param playlistData - PlaylistData to add new videos to.
	// @param errorUi - ErrorUi to send errors to.
	constructor(titleId, urlId, buttonId, playlistData, errorUi) {
		this.titleInput = document.getElementById(titleId);
		this.urlInput = document.getElementById(urlId);
		this.submitButton = document.getElementById(buttonId);
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.startAddVideoListener();
	}

	// Adds a new video to the playlist based on text inputs.
	async addVideo() {			
		var id = this._idFromInput();
		var title = await this._titlePromiseFromInput(id);
		this.playlistData.appendVideo(title, id);
		this.clearInputs();
	}

	// Setup submission button to trigger video additions.
	startAddVideoListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.submitButton.addEventListener(
			'click',
			() => {
				self.addVideo();
			}
		);
	}

	// removes all user text from associated UI elements
	clearInputs() {
		this.titleInput.value = '';
		this.urlInput.value = '';
	}
	
	// Extract the video id from the input's YouTube URL
	_idFromInput() {
		// regular expression, isolates ID from all known YouTube URL types
		const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		try {
			const url = this.urlInput.value;
			const results = url.match(regex);
			return results[1];
		} catch (error) {
			var customErrorMessage = null;
			if (error instanceof TypeError) {
				customErrorMessage = "Could not extract ID, please provide a YouTube video URL.";
			}
			this.errorUi.displayError(error, customErrorMessage);
		}
	}

	// Extract title from user input, or if none obtain from the video via API
	async _titlePromiseFromInput(id) {
		// if the user entered a viable title, we're done, just use that
		var title = trimOuterWhiteSpace( this.titleInput.value );		
		if (title !== '') {
			return title;
		}

		// If the user didn't provide a title, we need to get it from the API.
		// Reference: https://oembed.com/
		const oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
		try {
			title = await fetch(oembedURL)
				.then( response => response.text() )
				.then( data => JSON.parse(data).title );
		} catch (error) {
			var errorMessage = null;
			if (error instanceof SyntaxError) {
				errorMessage = "YouTube didn't return a title for that video ID.";
			}
			this.errorUi.displayError(error, errorMessage);
		}
		return title;
	}
}

export default AddVideoUi;
