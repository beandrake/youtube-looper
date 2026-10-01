
///////////////////////////////////////////////////////
//              Load Playlist from File
///////////////////////////////////////////////////////


const playlistElement = document.getElementById('playlist');

const loadPlaylist = () => {
	// retrive playlist data from file and create radio buttons for each
	fetch('./playlist.txt')
		.then( response => response.text() )
		.then(
			data => {
				generatePlaylistRadioButtons(data);
			}
		)
}

const generatePlaylistRadioButtons = (data) => {
	// parse line by line; lines will be in pairs, a title followed by an id
	const lineList = data.split('\n');
	var title = null; 
	for (let index = 0; index < lineList.length; index++) {
		// strip any surrounding white space
		line = lineList[index].replace(/^\s+/, '').replace(/\s+$/, '');
		// skip over empty lines
		if (line === '') {
			continue;
		}
		// if we don't yet have a title, this line is the title
		if (!title) {
			title = line;
		// otherwise, this line is the id, and we create a new entry
		} else {
			createRadioButton(title, line);
			title = null;
		}
	}
	// if there was a title without a corresponding ID, the data was bad
	if (title) {
		throw new Error("Loaded Playlist data was malformed!");
	}

}

const createRadioButton = (title, id) => {
	// HTML for this playlist entry
	playlistElement.innerHTML += `
		<input type="radio" name="video-option" id="playlist-${id}" value="${id}">
		<label for="playlist-${id}">${title}</label>
		<br>
	`;
}

// when the window loads, populate the playlist
window.onload = loadPlaylist;


///////////////////////////////////////////////////////
//              Load a Specific Video
///////////////////////////////////////////////////////

const frameElement = document.getElementById('youtube-frame');
const buttonElement = document.getElementById('add-button');

// replaces the YouTube video in the iframe with the user's selection
const loadVideo = (videoID) => {
	// get value from currently selected radio button
	//var videoID = document.querySelector('input[name="video-option"]:checked').value;
	
	// if value is "custom", we need to extract the videoID from the user's URL
	if (videoID == 'custom') {
		const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		const url = document.getElementById('user-url').value;
		const results = url.match(regex);
		videoID = results[1];
	}
	
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

