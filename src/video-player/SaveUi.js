import PairData from './../utils/PairData.js';
import FileOps from './../utils/FileOps.js';
import Listener from './common/Listener.js';

const PLAYLIST_FILENAME = "playlist.txt";
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

	// Adds a new video to the playlist based on text inputs.
	savePlaylistLocally() {			
		try {
			const videoList = this.playlistData.getVideoList(true);
			
			// convert to array of 2D arrays
			const arrayList = [];
			for (let video of videoList) {
				arrayList.push( [video.title, video.youtubeId] );
			}

			var stringData = PairData.stringFromArray(arrayList);
			FileOps.saveToFile(stringData, PLAYLIST_FILENAME);
		} catch (error) {
			var message = "Problem saving playlist locally.";
			this.errorUi.displayError(message);
			return;
		}
	}
}

export default SaveUi;
