import FileOps from './../utils/FileOps.js';
import Listener from './../common/Listener.js';

const PLAYLIST_FILENAME = "playlist.json";
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
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		const buttonFunction = () => this.savePlaylistLocally();
		this.button = new Listener(buttonId, buttonFunction);
	}

	// Save the playlist to a local file.
	savePlaylistLocally() {			
		try {
			const videoList = this.playlistData.getVideoList(true);
			
			// Remove IDs, as they don't need to be preserved.
			for (let video of videoList) {
				delete video.id;
			}

			// Convert from object to JSON, then save as file
			const stringData = JSON.stringify(videoList);
			FileOps.saveToFile(stringData, PLAYLIST_FILENAME);
		} catch (error) {
			var message = "Problem saving playlist locally.";
			this.errorUi.displayError(message);
			return;
		}
	}
}

export default SaveUi;
