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
	// @playlistUi - PlaylistUi to add new videos to.
	// @errorUi - ErrorUi to send errors to.
	constructor(titleId, urlId, buttonId, playlistUi, errorUi) {
		this.titleInput = document.getElementById(titleId);
		this.urlInput = document.getElementById(urlId);
		this.submitButton = document.getElementById(buttonId);
		
		this.playlist = playlistUi;
		this.errorUi = errorUi;

		this.startAddVideoListener();
	}

	// Adds a new video to the playlist based on text inputs.
	addVideo() {			
		var id = this._idFromInput();
		var titlePromise = this._titlePromiseFromInput(id);
		this._queueVideoAddition(id, titlePromise);
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
				customErrorMessage = "Unfamiliar URL structure, could not extract ID.";
			}

			this.errorUi.displayError(error, customErrorMessage);
		}
	}

	// Extract title from user input, or if none obtain from the video via API
	_titlePromiseFromInput(id) {
		// get user-entered title
		var title = trimOuterWhiteSpace( this.titleInput.value );
		
		// If the user didn't provide a title, we need to get it from the API,
		// and doing that requires an asyncronous promise.
		// Because of that, even if the user provided a title, we'll return it
		// as a promise, so that after that both cases get handled identically.
		if (title !== '') {
			// return title in a promise that resolves immediately
			return Promise.resolve(title);
		}else{
			// user didn't provide title, so retrieve from API
			// Reference: https://oembed.com/
			const oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
			// return a promise that may take some time to process
			return fetch(oembedURL)
				.then( response => response.text() )
				.then( data => JSON.parse(data).title )
				.catch( error => this.errorUi.displayError(error) );
		}
	}

	// when the promise finishes its other instructions, add a new video
	_queueVideoAddition(id, titlePromise) {
		titlePromise.then( 
			title => {
				this.playlist.appendVideo(title, id);
				// clear fields
				this.titleInput.value = '';
				this.urlInput.value = '';
			}
		).catch( error => this.errorUi.displayError(error) );
	}
}

export default AddVideoUi;
