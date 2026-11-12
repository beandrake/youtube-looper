import Listener from './../common/Listener.js';
/**
 * HotkeyUi
 * Detects key presses and acts on them.
 */
class HotkeyUi {
	// @param youtubeUi - YouTubeUi to inform
	// @param errorUi - ErrorUi to send errors to.
	constructor(youtubeUi, errorUi) {
		this.youtubeUi = youtubeUi
		this.errorUi = errorUi;

		const callback = (e) => this.hotkeyCheck(e);
		this.keyListener = new Listener(document, callback, ['keydown']);
	}

	// check for hotkeys
	hotkeyCheck(e) {
		// prevents repeated input from holding a key
		if (e.repeat) {
			return;
		}
		
		// ignore hotkeys when the user is in a field they can type in
		if ( this._textFieldSelected() ) {
			return;
		}
		//console.log(`${e.key}`);

		// K = toggle between Play and Pause.
		if ( `${e.key}`.toLowerCase() == "k" ) {
			this.youtubeUi.togglePlayAndPause();
		}
	}

	// returns true if the user selection is a text field
	_textFieldSelected() {
		const active = document.activeElement;

		if (active.nodeName.toUpperCase() == "INPUT") {
			const textTypes = [
				'email', 'month', 'number', 'password', 'search', 'text', 'tel',
				'url', 'week', 'datetime'
			];		
			if ( textTypes.includes( active.type.toLowerCase() ) ) {
				return true;
			}
		}

		if (active.nodeName.toUpperCase() == "TEXTAREA") {
			return true;
		}
		
		if (active.isContentEditable) {
			return true;
		}

		return false
	}
}

export default HotkeyUi;