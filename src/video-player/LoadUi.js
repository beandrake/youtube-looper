import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
/**
 * LoadUi
 * The interface to load playlist data from a local file.
 * If the user clicks the button, they can choose a file to load.
 */
class LoadUi {
	// @param buttonId - id for a button input element of type "file".
	// @playlistData - PlaylistData to load videos into.
	// @errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, errorUi) {
		this.loadButton = document.getElementById(buttonId);
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.startLoadListener();
	}

	// Adds a new video to the playlist based on text inputs.
	async loadPlaylist() {			
		try {			
			var stringData = await FileOps.loadFromInputFileElement(this.loadButton);
			var list = PairData.arrayFromString(stringData);
		} catch (error) {
			this.errorUi.displayError(error);
		}
		this.playlistData.loadFromArray(list);
	}

	// Setup button so that when the user selects a file, we start to load.
	startLoadListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.loadButton.addEventListener(
			'change',
			() => {
				self.loadPlaylist();
			}
		);
	}
}

export default LoadUi;
