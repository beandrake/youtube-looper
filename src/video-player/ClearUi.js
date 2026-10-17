/**
 * ClearAllUi
 * Clears all songs from the playlist.
 */
class ClearUi {
	// @param buttonId - id for a button element.
	// @playlistData - PlaylistData to add new videos to.
	// @errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, errorUi) {
		this.clearButton = document.getElementById(buttonId);
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.startListener();
	}

	// Setup button.
	startListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.clearButton.addEventListener(
			'click',
			() => {
				self.playlistData.clearAll();
			}
		);
	}
}

export default ClearUi;
