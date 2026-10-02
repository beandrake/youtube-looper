
/*
	Thoughts about organization.

	Page
		List UI
		AddVideo UI
		Hide UI
		Load UI
		Save UI
		Frame HTML
		List Model

	ON PAGE LOAD
		List Model <- loads from file
		List UI <- reapply HTML from List Model (or based on it)

	List UI -CLICK->
		Update Frame <- based on List UI

	AddVideo UI -CLICK->
		List Model <- append from AddVideo UI
		List UI <- reapply HTML from List Model (or based on it)
		Update AddVideo UI <- clear text
	
	Hide UI -CLICK->
		Update Frame

	Load UI -CLICK->
		List Model <- loads from file
		List UI <- reapply HTML from List Model (or based on it)

	Save UI -CLICK->
		List Model <- Used to create text file


	List Model connects to almost everything else.
	List Model should probably own the responsibility for updating other things.
	
*/

const trimOuterWhiteSpace = (text) => {
	return text.replace(/^\s+/, '').replace(/\s+$/, '');
}


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
			)
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
		// TODO: handle error
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

addVideoUI.addVideoAndClearFields = (title, id) => {
	playlist.appendVideo(title, id);
	addVideoUI.titleElement.value = '';
	addVideoUI.urlElement.value = '';
}

addVideoUI.handleAddVideo = () => {
	const url = addVideoUI.urlElement.value;
	const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	const results = url.match(regex);
	const id = results[1];
	// TODO: handle error when invalid video URL
	
	var title = trimOuterWhiteSpace( addVideoUI.titleElement.value );
	if (title === '') {
		// Reference: https://oembed.com/
		oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
		fetch(oembedURL)
			.then( response => response.text() )
			.then(
				data => {
					videoData = JSON.parse(data);
					title = videoData.title;
					addVideoUI.addVideoAndClearFields(title, id);
				}
			)
	}else{
		addVideoUI.addVideoAndClearFields(title, id);
	}
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
