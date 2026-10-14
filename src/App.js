import ErrorUi from './video-player/ErrorUi.js';
import AddVideoUi from './video-player/AddVideoUi.js';
import PlaylistData from './video-player/PlaylistData.js';
import PlaylistUi from './video-player/PlaylistUi.js';
import SaveUi from './video-player/SaveUi.js';
//import LoadUi from './video-player/LoadUi.js';

class App {
	constructor() {		
		const PLAYLIST_ID = 'playlist';
		const VIDEO_FRAME_ID = 'youtube-frame';
		const ADD_VIDEO_TITLE_ID = 'title-input';
		const ADD_VIDEO_URL_ID = 'url-input';
		const ADD_VIDEO_BUTTON_ID = 'add-video-button';
		const SAVE_BUTTON = 'save-button';
		const LOAD_BUTTON = 'load-button';
		const ERROR_TEXT_ID = 'error-text';
		const ERROR_BUTTON_ID = 'error-button';

		const DEFAULT_PLAYLIST_FILE = './data/playlist.txt';

		this.errorUi = new ErrorUi(ERROR_TEXT_ID, ERROR_BUTTON_ID);
		this.playlistUi = new PlaylistUi(VIDEO_FRAME_ID, PLAYLIST_ID, this.errorUi);
		this.playlistData = new PlaylistData(PLAYLIST_ID, this.playlistUi, this.errorUi);
		this.addVideoUi = new AddVideoUi(
			ADD_VIDEO_TITLE_ID, ADD_VIDEO_URL_ID, ADD_VIDEO_BUTTON_ID,
			this.playlistData, this.errorUi
		);
		this.saveUi = new SaveUi(SAVE_BUTTON, this.playlistData, this.errorUi);
		//this.loadUi = new LoadUi(LOAD_BUTTON, this.playlistData, this.errorUi);


		// populate playlist from default playlist file
		this.playlistData.loadFromWebFile(DEFAULT_PLAYLIST_FILE);
	}
}

const app = new App();
