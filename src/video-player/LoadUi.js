import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
import Listener from './common/Listener.js';
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
		// file element, which is not applied to the DOM
		this.fileElement = document.createElement("input");
		this.fileElement.type = "file";
		
		this.playlistData = playlistData;
		this.errorUi = errorUi;
		
		// forward click to hidden file input, letting user select a file
		const loadFunction = () => this.fileElement.click();
		this.loadButton = new Listener(buttonId, loadFunction);

		// responds to the user selecting a file by loading the file's playlist
		const fileFunction = () => this.loadPlaylist();
		this.fileListener = new Listener(this.fileElement, fileFunction, ['change']);
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
}

export default LoadUi;
