/**
 * YouTubeOps
 * Contains functions related to YouTube URLs and IDs.
 */
var YouTubeOps = new function() {

	// All YouTube video IDs are 11 characters.
	this.VIDEO_ID_LENGTH = 11;

	// Returns the ID that was within the URL
	// @param url - a YouTube video URL
	this.extractIdFromUrl = function(url) {
		// regular expression, isolates ID from all known YouTube URL types
		const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		let results = url.match(regex);

		// check that we retrieved something shaped like an ID
		if (results.length >= 1 && results[1].length == this.VIDEO_ID_LENGTH) {
			return results[1];
		} else {
			throw new Error("Not a valid YouTube URL.");
		}
	}

	// Returns a promise for a string containing the title of the video
	// @param id - ID of the YouTube video
	this.getVideoTitle = function(id) {
		// Reference: https://oembed.com/
		const oembedURL = `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${id}&format=json`;
		return fetch(oembedURL)
			.then( response => response.text() )
			.then( data => JSON.parse(data).title );		
	}

	// Returns a URL that will loop a specific YouTube video when in an iframe
	// @param id - ID of the YouTube video
	this.generateLoopingUrl = function(id) {
		return `https://www.youtube.com/embed/${id}?playlist=${id}&loop=1`;
	}



}

export default YouTubeOps;