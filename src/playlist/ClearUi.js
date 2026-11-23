import Listener from './../common/Listener.js';
/**
 * ClearUi
 * Clears all songs from the playlist.
 */
class ClearUi {
	// @param buttonId - id for a button element.
	// @playlistData - PlaylistData to add new videos to.
	constructor(buttonId, playlistData) {				
		this.playlistData = playlistData;

		const buttonFunction = () => this.playlistData.clearAll();
		this.button = new Listener(buttonId, buttonFunction);
	}
}

export default ClearUi;
