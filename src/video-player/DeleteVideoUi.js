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
		
		this.playlistData = playlistData;
		this.playlistUi = playlistUi;
		this.errorUi = errorUi;

		this.startListener();
	}

	// delete the selected entry in the video list
	deleteVideo() {
		// get selected video from Playlist UI.
		let index = this.playlistUi.getSelectedVideoIndex();

		// if no video selected, error
		if (index == null) {
			let message = "Can't delete a video unless a video is selected.";
			this.errorUi.displayError(message);
			return;
		}

		// delete video from Playlist data.
		try {
			this.playlistData.removeVideo(index);
		} catch (error) {
			let message = `Failed to delete video, something went wrong.`;
			this.errorUi.displayError(message);
			return;
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
