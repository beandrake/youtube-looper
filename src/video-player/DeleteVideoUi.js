/**
 * DeleteVideoUi
 * The interface that deletes videos from the playlist.
 */
class DeleteVideoUi {
	// @param buttonId - the id for a button element
	// @param playlistData - PlaylistData to delete from
	// @param playlistUi - PlaylistUi to retrieve selection from
	// @param errorUi - ErrorUi to send errors to.
	constructor(buttonId, playlistData, playlistUi, errorUi) {
		this.deleteButton = document.getElementById(buttonId);
		this.readyToDelete = false;
		this.defaultButtonBackground = this.deleteButton.style.background;
		
		this.playlistData = playlistData;
		this.playlistUi = playlistUi;
		this.errorUi = errorUi;

		this.startListener();
	}


	deleteVideo() {
		// get selected video from Playlist UI.
		let id = this.playlistUi.getSelectedVideoId();

		// if no video selected, error
		if (id == null) {
			let error = new Error("Can't delete a video unless a video is selected.");
			this.errorUi.displayError(error);
		}

		// delete video from Playlist data.
		let index = this.playlistData.removeVideo(id);
		if (index < 0) {
			let error = new Error(`No video with id ${id} found in PlaylistData.`);
			this.errorUi.displayError(error);
		}
	}

	// Setup button listener.
	startListener() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.deleteButton.addEventListener(
			'click',
			() => {
				self.deleteVideo();
			}
		);
	}

}

export default DeleteVideoUi;
