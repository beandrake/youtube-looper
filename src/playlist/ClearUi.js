import EventSystem from './../common/EventSystem.js';
import Listener from './../common/Listener.js';
/**
 * ClearUi
 * Clears all songs from the playlist.
 */
class ClearUi {
	// @param buttonId - id for a button element.
	constructor(buttonId) {

		const buttonFunction = () => this.clearPlaylist();
		this.button = new Listener(buttonId, buttonFunction);
	}

	// Sends the command to clear the playlist of entries
	clearPlaylist() {
		EventSystem.publish("user.command.playlist.clear");
	}
}

export default ClearUi;
