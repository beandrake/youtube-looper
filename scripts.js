
const trimOuterWhiteSpace = (text) => {
	return text.replace(/^\s+/, '').replace(/\s+$/, '');
}

///////////////////////////////////////////////////////
//               ErrorUI
///////////////////////////////////////////////////////


class ErrorUI {
	constructor(textID, buttonID) {
		this.errorMessageElement = document.getElementById(textID);
		this.clearErrorButton = document.getElementById(buttonID);
		this.clearError();
		this.startClearErrorListener();
	}

	displayError = (error, customMessage=null) => {
		// construct error text with timestamp
		const now = new Date();
		const timestamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		const message = customMessage ? customMessage : error.message;
		const outputText = timestamp + " ERROR: " + message;
		// display error text
		this.errorMessageElement.innerText = outputText;
		// reveal clear error button
		this.clearErrorButton.style.display = "inline";
		// release the error into the open arms of the stack
		throw error;
	}

	clearError = () => {
		this.errorMessageElement.innerText = "";
		this.clearErrorButton.style.display = "none";
	}

	startClearErrorListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.clearErrorButton.addEventListener(
			'click',
			() => {
				self.clearError();
			}
		);
	}
}

///////////////////////////////////////////////////////
//           Persistent Playlist Object
///////////////////////////////////////////////////////

const playlistElement = document.getElementById('playlist');

class Playlist {
	constructor(playlistID, errorUI) {
		this.playlistElement = document.getElementById(playlistID);
		this.errorUI = errorUI;

		this.videoList = []
	}

	clearAll() {
		this.videoList = [];
	}

	appendVideo(title, id) {
		this._appendVideo(title, id);
		this._updateWebpage();
	}

	_appendVideo(title, id) {
		var video = { title: title, id: id };
		this.videoList.push(video);
	}

	_updateWebpage() {
		// Generates HTML that we will insert within the playlist element
		let html = '';
		let count = 0
		for (let video of this.videoList) {
			html += `
				<input
					type="radio" name="video-option"
					id="playlist-${count}" value="${video.id}"
				>
				<label for="playlist-${count}">${video.title}</label><br>`;
			count++;
		}
		this.playlistElement.innerHTML = html;
	}

	loadFromFile(source) {
		var arrayPromise = PairDataSet.loadFromFile(source);
		arrayPromise.catch( error => this.errorUI.displayError(error) )
			.then( data => this.loadFromArray(data) );
	}

	loadFromArray(list) {
		this.clearAll();

		// expects an array of 2-dimensional arrays, containing title and ID
		try {
			for (let pair of list) {
				this._appendVideo( pair[0], pair[1] );
			}
		} catch (error) {
			var customErrorMessage = "Problem loading playlist from array.";
			this.errorUI.displayError(error, customErrorMessage);
		}
		this._updateWebpage();
	}
}

const PLAYLIST_FILE = './playlist.txt';
const PLAYLIST_LOAD_ERROR = "Loaded Playlist data was malformed!"

var PairDataSet = new function() {

	// Returns a promise for an array of 2-dimensional arrays
	this.loadFromFile = function(source) {	
		return fetch(source)
			.then( response => response.text() )
			.then( data => this._loadFromData(data)	);
	}

	// Returns an array of 2-dimensional arrays
	this._loadFromData = function(data) {
		// parse line by line; lines will be in pairs, a title followed by an id
		const lineList = data.split('\n');
	
		// Data format: lines are in pairs, white space lines are not counted
		var pairList = [];		
		var pair = []; 
		for (let index = 0; index < lineList.length; index++) {
			// strip any surrounding white space
			let line = trimOuterWhiteSpace( lineList[index] );
			// skip over empty lines
			if (line === '') {
				continue;
			}
			
			pair.push(line);
			if (pair.length == 2) {
				pairList.push(pair);
				pair = [];
			}
		}

		// if the file ended with an incomplete pair, error
		if (pair.length == 1) {
			throw new Error("While loading pairs from data, data ended mid-pair!");
		}
		return pairList;
	}

	this.saveToFile = function(data, destination) {
		// implement me
	}
}


///////////////////////////////////////////////////////
//               Add a New Video
///////////////////////////////////////////////////////

class AddVideoUI {
	
	constructor(titleID, urlID, buttonID, playlistUI, errorUI) {
		this.titleInput = document.getElementById(titleID);
		this.urlInput = document.getElementById(urlID);
		this.submitButton = document.getElementById(buttonID);
		
		this.playlist = playlistUI;
		this.errorUI = errorUI;

		this.startAddVideoListener();
	}

	addVideo() {			
		var id = this._idFromInput();
		var titlePromise = this._titlePromiseFromInput(id);
		this._queueVideoAddition(id, titlePromise);
	}

	startAddVideoListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.submitButton.addEventListener(
			'click',
			() => {
				self.addVideo();
			}
		);
	}
	
	_idFromInput() {
		// extract YouTube video ID from URL using this regular expression
		const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		try {
			const url = this.urlInput.value;
			const results = url.match(regex);
			return results[1];
		} catch (error) {
			var customErrorMessage = null;
			if (error instanceof TypeError) {
				customErrorMessage = "Unfamiliar URL structure, could not extract ID.";
			}

			this.errorUI.displayError(error, customErrorMessage);
		}
	}

	_titlePromiseFromInput(id) {
		// get user-entered title
		var title = trimOuterWhiteSpace( this.titleInput.value );
		
		// If the user didn't provide a title, we need to get it from the API,
		// and doing that requires an asyncronous promise.
		// Because of that, even if the user provided a title, we'll return it
		// as a promise, so that after that both cases get handled identically.
		if (title !== '') {
			// return title in a promise that resolves immediately
			return Promise.resolve(title);
		}else{
			// user didn't provide title, so retrieve from API
			// Reference: https://oembed.com/
			const oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
			// return a promise that may take some time to process
			return fetch(oembedURL)
				.then( response => response.text() )
				.then( data => JSON.parse(data).title )
				.catch( error => this.errorUI.displayError(error) );
		}
	}

	_queueVideoAddition(id, titlePromise) {
		// when the promise finishes its other instructions, add a new video
		titlePromise.then( 
			title => {
				this.playlist.appendVideo(title, id);
				// clear fields
				this.titleInput.value = '';
				this.urlInput.value = '';
			}
		).catch( error => this.errorUI.displayError(error) );
	}
}





class App {
	constructor() {
		this.errorUI = new ErrorUI('error-text', 'error-button');
		this.playlist = new Playlist('playlist', this.errorUI);
		this.playlist.loadFromFile('./playlist.txt');
		this.addVideoUI = new AddVideoUI('title-input', 'url-input', 'add-video-button', this.playlist, this.errorUI);

		//this.
	}


}

const app = new App();





///////////////////////////////////////////////////////
//              Load a Specific Video
///////////////////////////////////////////////////////

const frameElement = document.getElementById('youtube-frame');

// replaces the YouTube video in the iframe with the user's selection
const loadVideo = (videoID) => {
	// create new looping embedded URL for iframe and apply it to the iframe
	const newSource = `https://www.youtube.com/embed/${videoID}?playlist=${videoID}&loop=1`;
	frameElement.src = newSource;
}


// this makes it so loadVideo gets called when we click a radio button
playlistElement.addEventListener(
	'change',
	(event) => {
		if ( event.target.matches('input[name="video-option"]') ) {
			loadVideo(event.target.value);
		}
	}
);



///////////////////////////////////////////////////////
//               Hide Video Option
///////////////////////////////////////////////////////

const hideButtonElement = document.getElementById('hide-button');

const toggleHiddenVideo = () => {
	if (frameElement.height > 0) {
		toggleHiddenVideo.previousHeight = frameElement.height;
		frameElement.height = 0;
	} else {
		frameElement.height = toggleHiddenVideo.previousHeight;
	}
}

hideButtonElement.addEventListener(
	'click',
	() => {
  		toggleHiddenVideo();
	}
);
