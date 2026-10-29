import YouTubeOps from './../utils/YouTubeOps.js';
import TextOps from './../utils/TextOps.js';
import Listener from './common/Listener.js';

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
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		const buttonFunction = (event) => this.handleClick(event);
		this.submitButton = new Listener(buttonId, buttonFunction);
	}

	// Depending on how the "click" was triggered, determine how to progress.
	handleClick(event) {
		// No matter what, if you click the submit button, this will
		// trigger. But if your inputs and button are in the same form
		// element, then pressing enter while an input is selected will
		// also cause this to trigger.
		
		// prevent default form behavior of reloading the page
		event.preventDefault();

		// If cursor in title input, progress cursor and don't submit.
		if (document.activeElement == this.titleInput) {
			this.urlInput.focus();
			return;	
		}

		this.addVideo();
	}
	
	// Adds a new video to the playlist based on text inputs.
	async addVideo() {			
		var id = this._idFromInput();
		if (id == null) {
			return;
		}
		
		var title = await this._titlePromiseFromInput(id);
		if (title == null) {
			return;
		}

		this.playlistData.appendVideo(title, id);
		this.clearInputs();
	}

	// Removes all user text from associated UI elements
	clearInputs() {
		this.titleInput.value = '';
		this.urlInput.value = '';
	}

	// Extract the video id from the input's YouTube URL
	_idFromInput() {		
		// regular expression, isolates ID from all known YouTube URL types
		try {
			const url = this.urlInput.value;
			// if input is the length of an ID, treat it as an ID
			if (url.length == YouTubeOps.VIDEO_ID_LENGTH) {
				return url;
			} else {
				return YouTubeOps.extractIdFromUrl(url);				
			}
		} catch (error) {
			var message = "Could not extract ID, please provide a YouTube video URL.";			
			this.errorUi.displayError(message);
			return null;
		}
	}

	// Extract title from user input, or if none obtain from the video via API
	async _titlePromiseFromInput(id) {
		// if the user entered a viable title, we're done, just use that
		var title = TextOps.trimOuterWhiteSpace( this.titleInput.value );		
		if (title !== '') {
			return title;
		}

		// If the user didn't provide a title, we need to get it from the API.		
		try {
			title = await YouTubeOps.getVideoTitle(id);
		} catch (error) {
			if (error instanceof SyntaxError) {
				let message = "YouTube didn't return a title for that video ID.";
				this.errorUi.displayError(message);
			} else {
				this.errorUi.displayError(error);
			}
			return null;
		}
		return title;
	}
}

export default AddVideoUi;
