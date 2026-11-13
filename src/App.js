import ErrorUi from './video-player/ErrorUi.js';
import YouTubeUi from './video-player/YouTubeUi.js';
import AddVideoUi from './playlist/AddVideoUi.js';
import DeleteVideoUi from './playlist/DeleteVideoUi.js';
import ReorderVideoUi from './playlist/ReorderVideoUi.js';
import PlaylistData from './playlist/PlaylistData.js';
import PlaylistUi from './playlist/PlaylistUi.js';
import SaveUi from './playlist/SaveUi.js';
import LoadUi from './playlist/LoadUi.js';
import ClearUi from './playlist/ClearUi.js';
import HotkeyUi from './video-player/HotkeyUi.js';

const DEFAULT_PLAYLIST_FILE = './data/default_playlist.json';
const DEFAULT_VIDEO = "SRczGJ-4M5g"; // Darude - Sandstorm

class App {
	constructor() {		
		const PLAYLIST_ID = 'playlist';
		const VIDEO_DIV_ID = 'youtube-player';
		//const VIDEO_FRAME_ID = 'youtube-frame';
		const ADD_VIDEO_TITLE_ID = 'title-input';
		const ADD_VIDEO_URL_ID = 'url-input';
		const ADD_VIDEO_BUTTON_ID = 'add-video-button';
		const SAVE_BUTTON_ID = 'save-button';
		const LOAD_BUTTON_ID = 'load-button';
		const MOVE_EARLIER_BUTTON_ID = 'move-earlier-button';
		const MOVE_LATER_BUTTON_ID = 'move-later-button';
		const DELETE_BUTTON_ID = 'delete-button';
		const CLEAR_BUTTON_ID = 'clear-button';
		const ERROR_TEXT_ID = 'error-text';
		const ERROR_BUTTON_ID = 'error-button';

		const CIRCULAR_BEHAVIOR_WHEN_MOVING_ITEMS = true;

		this.playlistData = new PlaylistData();
		this.errorUi = new ErrorUi(ERROR_TEXT_ID, ERROR_BUTTON_ID);
		this.youtubeUi = new YouTubeUi(VIDEO_DIV_ID, DEFAULT_VIDEO);
		this.playlistUi = new PlaylistUi(PLAYLIST_ID, this.playlistData, this.youtubeUi, this.errorUi);
		this.addVideoUi = new AddVideoUi(
			ADD_VIDEO_TITLE_ID, ADD_VIDEO_URL_ID, ADD_VIDEO_BUTTON_ID,
			this.playlistData, this.errorUi
		);
		this.deleteVideoUi = new DeleteVideoUi(
			DELETE_BUTTON_ID,
			this.playlistData, this.playlistUi, this.errorUi
		);
		this.reorderVideoUi = new ReorderVideoUi(
			MOVE_EARLIER_BUTTON_ID, MOVE_LATER_BUTTON_ID,
			this.playlistData, this.playlistUi, this.errorUi,
			CIRCULAR_BEHAVIOR_WHEN_MOVING_ITEMS
		);
		this.saveUi = new SaveUi(SAVE_BUTTON_ID, this.playlistData, this.errorUi);
		this.loadUi = new LoadUi(LOAD_BUTTON_ID, this.playlistData, this.errorUi);
		this.clearAllUi = new ClearUi(CLEAR_BUTTON_ID, this.playlistData, this.errorUi);
		this.hotkeyUi = new HotkeyUi(this.youtubeUi, this.errorUi);
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