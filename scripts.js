
const trimOuterWhiteSpace = (text) => {
	return text.replace(/^\s+/, '').replace(/\s+$/, '');
}

const errorTextElement = document.getElementById('error-text');
const errorButtonElement = document.getElementById('error-button');

const displayError = (error, message=null) => {
	const now = new Date();
	const timestamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	// display error text
	const outputText = message ? message : error.message;
	errorTextElement.innerText = timestamp + " ERROR: " + outputText;
	console.log(error);
	// reveal clear error button
	errorButtonElement.style.display = "inline";
}

const clearError = () => {
	errorTextElement.innerText = "";
	errorButtonElement.style.display = "none";
}

errorButtonElement.addEventListener(
	'click',
	() => {
  		clearError();
	}
);


const playlistElement = document.getElementById('playlist');

///////////////////////////////////////////////////////
//           Persistent Playlist Object
///////////////////////////////////////////////////////

class Playlist {
	constructor() {
		this.loadFromFile();
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

	loadFromFile(source='./playlist.txt') {
		fetch(source)
			.then( response => response.text() )
			.then(
				data => {
					this._loadFromData(data);
					this._updateWebpage();
				}
			).catch( error => displayError(error) );
	}

	_loadFromData(data) {
		this.clearAll();

		// parse line by line; lines will be in pairs, a title followed by an id
		const lineList = data.split('\n');
		var title = null; 
		for (let index = 0; index < lineList.length; index++) {
			// strip any surrounding white space
			let line = trimOuterWhiteSpace( lineList[index] );
			// skip over empty lines
			if (line === '') {
				continue;
			}
			// if we don't yet have a title, this line is the title
			if (!title) {
				title = line;
			// otherwise, this line is the id, and we create a new entry
			} else {
				this._appendVideo(title, line);
				title = null;
			}
		}

		// if there was a title without a corresponding ID, the data was bad
		if (title) {
			throw new Error("Loaded Playlist data was malformed!");
		}
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
		playlistElement.innerHTML = html;
	}
}

const playlist = new Playlist();


///////////////////////////////////////////////////////
//               Add a New Video
///////////////////////////////////////////////////////


var addVideoUI = {
	titleElement: document.getElementById('new-title'),
	urlElement: document.getElementById('new-url'),
	buttonElement: document.getElementById('add-button'),
};


addVideoUI.handleAddVideo = () => {
	// extract YouTube video ID from URL
	const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	var id;
	try {
		const url = addVideoUI.urlElement.value;
		const results = url.match(regex);
		id = results[1];
	} catch (error) {
		customErrorMessage = null;
		if (error instanceof TypeError) {
			customErrorMessage = "Unfamiliar URL structure, could not extract ID.";
		}

		displayError(error, customErrorMessage);
		return;
	}
		
	var title = trimOuterWhiteSpace( addVideoUI.titleElement.value );

	// if user didn't provide title, fetch from API
	// Note: either way we use promises so we can finish the same way
	var titlePromise;
	if (title !== '') {
		// waits for a promise that is delivered immediately
		titlePromise = Promise.resolve(title);
	}else{
		// Reference: https://oembed.com/
		oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
		titlePromise = fetch(oembedURL)
			.then( response => response.text() )
			.then( data => JSON.parse(data).title )
			.catch( error => displayError(error) );
	}

	// whatever happened above, when the promise resolves, add video
	titlePromise.then( 
		title => {
			playlist.appendVideo(title, id);
			// clear fields
			addVideoUI.titleElement.value = '';
			addVideoUI.urlElement.value = '';
		}
	).catch( error => displayError(error) );
}


addVideoUI.buttonElement.addEventListener(
	'click',
	() => {
  		addVideoUI.handleAddVideo();
	}
);


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
