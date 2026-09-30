
const frameElement = document.getElementById('youtube-frame');
const buttonElement = document.getElementById('load-button');


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
	
	// create new loop URL for iframe and apply it
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
