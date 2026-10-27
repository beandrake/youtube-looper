import ErrorUi from './video-player/ErrorUi.js';
import AddVideoUi from './video-player/AddVideoUi.js';
import DeleteVideoUi from './video-player/DeleteVideoUi.js';
import ReorderVideoUi from './video-player/ReorderVideoUi.js';
import PlaylistData from './video-player/PlaylistData.js';
import PlaylistUi from './video-player/PlaylistUi.js';
import SaveUi from './video-player/SaveUi.js';
import LoadUi from './video-player/LoadUi.js';
import ClearUi from './video-player/ClearUi.js';

const DEFAULT_PLAYLIST_FILE = './data/playlist.txt';

class App {
	constructor() {		
		const PLAYLIST_ID = 'playlist';
		const VIDEO_FRAME_ID = 'youtube-frame';
		const ADD_VIDEO_TITLE_ID = 'title-input';
		const ADD_VIDEO_URL_ID = 'url-input';
		const ADD_VIDEO_BUTTON_ID = 'add-video-button';
		const SAVE_BUTTON = 'save-button';
		const LOAD_BUTTON = 'load-button';
		const MOVE_EARLIER_BUTTON = 'move-earlier-button';
		const MOVE_LATER_BUTTON = 'move-later-button';
		const DELETE_BUTTON = 'delete-button';
		const CLEAR_BUTTON = 'clear-button';
		const ERROR_TEXT_ID = 'error-text';
		const ERROR_BUTTON_ID = 'error-button';

		const CIRCULAR_BEHAVIOR_WHEN_MOVING_ITEMS = true;

		this.errorUi = new ErrorUi(ERROR_TEXT_ID, ERROR_BUTTON_ID);
		this.playlistUi = new PlaylistUi(VIDEO_FRAME_ID, PLAYLIST_ID, this.errorUi);
		this.playlistData = new PlaylistData(PLAYLIST_ID, this.playlistUi);
		this.addVideoUi = new AddVideoUi(
			ADD_VIDEO_TITLE_ID, ADD_VIDEO_URL_ID, ADD_VIDEO_BUTTON_ID,
			this.playlistData, this.errorUi
		);
		this.deleteVideoUi = new DeleteVideoUi(
			DELETE_BUTTON,
			this.playlistData, this.playlistUi, this.errorUi
		);
		this.reorderVideoUi = new ReorderVideoUi(
			MOVE_EARLIER_BUTTON, MOVE_LATER_BUTTON,
			this.playlistData, this.playlistUi, this.errorUi,
			CIRCULAR_BEHAVIOR_WHEN_MOVING_ITEMS
		);
		this.saveUi = new SaveUi(SAVE_BUTTON, this.playlistData, this.errorUi);
		this.loadUi = new LoadUi(LOAD_BUTTON, this.playlistData, this.errorUi);
		this.clearAllUi = new ClearUi(CLEAR_BUTTON, this.playlistData, this.errorUi);
	}

	async initialize() {
		// populate playlist from default playlist file
		try {
			var result = await this.playlistData.loadFromWebFile(DEFAULT_PLAYLIST_FILE);
		} catch (error) {
			this.errorUi.displayError("Failed to initialize default playlist.");
		}
	}
}

const app = new App();
app.initialize();
