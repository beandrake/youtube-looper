
const frameElement = document.getElementById('youtube-frame');
const formElement = document.getElementById('playlist');
const buttonElement = document.getElementById('load-button');


///////////////////////////////////////////////////////
//              Load Playlist from File
///////////////////////////////////////////////////////


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
	for (var index = 0; index < lineList.length; index++) {
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

const createRadioButton = (title, youtube_id) => {
	// initialize entry_id to 0 if this is the first call to this function
	createRadioButton.entry_id = createRadioButton.entry_id || 0;
	
	// HTML for this playlist entry
	formElement.innerHTML += `
		<input type="radio" name="song-choice" id="playlist${createRadioButton.entry_id}" value="${youtube_id}">
		<label for="playlist${createRadioButton.entry_id}">${title}</label>
		<br>
	`;

	createRadioButton.entry_id++;
}



// when the window loads, populate the playlist
window.onload = loadPlaylist;


///////////////////////////////////////////////////////
//              Load a Specific Video
///////////////////////////////////////////////////////

// replaces the YouTube video in the iframe with the user's selection
const loadVideo = () => {
	// get value from currently selected radio button
	var songID = document.querySelector('input[name="song-choice"]:checked').value;
	
	// if value is "custom", we need to extract the songID from the user's URL
	if (songID == 'custom') {
		const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		const url = document.getElementById('user-url').value;
		const results = url.match(regex);
		songID = results[1];
	}
	
	// create new looping embedded URL for iframe and apply it to the iframe
	const newSource = `https://www.youtube.com/embed/${songID}?playlist=${songID}&loop=1`;
	frameElement.src = newSource;
}

// this makes it so loadVideo gets called when we click the button
buttonElement.addEventListener(
	'click',
	() => {
  		loadVideo();
	}
);



