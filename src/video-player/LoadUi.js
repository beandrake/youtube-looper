import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
/**
 * LoadUi
 * The interface to load playlist data from a local file.
 * When the button is clicked, it prompts the user to select a file.
 * When a file is selected, its data is loaded.
 */
class LoadUi {
	// @param buttonId - id for a button that triggers loading
	// @playlistData - PlaylistData to load video data into.
	// @errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, errorUi) {
		this.loadButton = document.getElementById(buttonId);
		// file element, which is not applied to the DOM
		this.fileElement = document.createElement("input");
		this.fileElement.type = "file";
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		this.startListeners();
	}

	// Adds a new video to the playlist based on text inputs.
	async loadPlaylist() {			
		try {			
			var stringData = await FileOps.loadFromInputFileElement(this.fileElement);
			var list = PairData.arrayFromString(stringData);
		} catch (error) {
			this.errorUi.displayError(error);
			return;
		}
		this.playlistData.loadFromArray(list);
	}

	// Set button to prompt file load, and file selection to result in loading.
	startListeners() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;

		// forward click to hidden file input, letting user select a file
		this.loadButton.addEventListener(
			'click',
			() => {
				self.fileElement.click();
			}
		);

		// responds to the user selecting a file by loading the file's playlist
		this.fileElement.addEventListener(
			'change',
			() => {
				self.loadPlaylist();
			}
		);
	}
}

export default LoadUi;
