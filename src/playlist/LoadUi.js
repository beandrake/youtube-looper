import FileOps from './../utils/FileOps.js';
import Listener from './../common/Listener.js';
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
		this.playlistData = playlistData;
		this.errorUi = errorUi;		
		
		// file element, which is not applied to the DOM
		this.fileElement = document.createElement("input");
		this.fileElement.type = "file";
		// During user file selection, default to only show these file types.
		this.fileElement.accept = ".json";
		// Enables user to select multiple files if they want.
		this.fileElement.multiple = "x";
		
		// forward click to hidden file input, letting user select a file
		const loadFunction = () => this.fileElement.click();
		this.loadButton = new Listener(buttonId, loadFunction);

		// responds to the user selecting a file by loading the file's playlist
		const fileFunction = () => this.loadPlaylist();
		this.fileListener = new Listener(this.fileElement, fileFunction, ['change']);
	}

	// Load playlist from user-selected file(s).
	async loadPlaylist() {			
		try {			
			var dataList = await FileOps.loadFromInputFileElement(this.fileElement);
		} catch (error) {
			this.errorUi.displayError("Error loading file.");
			return;
		}

		try {						
			var aggregateVideoList = [];
			for (let data of dataList) {
				let videoList = JSON.parse(data);
				aggregateVideoList = aggregateVideoList.concat(videoList);
			}
			this.playlistData.loadFromArray(aggregateVideoList);
		} catch (error) {
			this.errorUi.displayError("File contains invalid data.");
			throw error;
			return;
		}
	}
}

export default LoadUi;
