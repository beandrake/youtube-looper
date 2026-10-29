import Listener from './common/Listener.js';
/**
 * ClearUi
 * Clears all songs from the playlist.
 */
class ClearUi {
	// @param buttonId - id for a button element.
	// @playlistData - PlaylistData to add new videos to.
	// @errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, errorUi) {				
		this.playlistData = playlistData;
		this.errorUi = errorUi;

		const buttonFunction = () => this.playlistData.clearAll();
		this.button = new Listener(buttonId, buttonFunction);
	}
}

export default ClearUi;
