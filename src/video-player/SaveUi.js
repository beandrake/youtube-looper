import PairDataSet from './../utils/PairDataSet.js';
/**
 * SaveUi
 * The interface to save playlist data to a local file.
 * If the user clicks the button, the save happens.
 */
class SaveUi {
	// @param buttonId - id for a button input element.
	// @playlistData - PlaylistData to add new videos to.
	// @errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, errorUi) {
		this.saveButton = document.getElementById(buttonId);
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.startSaveListener();
	}

	// Adds a new video to the playlist based on text inputs.
	savePlaylistLocally() {			
		try {
			var videoList = this.playlistData.getVideoList(true);
			PairDataSet.saveToFile(videoList, "playlist.txt");
		} catch (error) {
			var customErrorMessage = "Problem saving playlist locally.";
			this.errorUi.displayError(error, customErrorMessage);
		}
	}

	// Setup submission button to trigger video additions.
	startSaveListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.saveButton.addEventListener(
			'click',
			() => {
				self.savePlaylistLocally();
			}
		);
	}
}

export default SaveUi;
