import EventSystem from './../common/EventSystem.js';
import Listener from './../common/Listener.js';
/**
 * DeleteVideoUi
 * The interface that deletes videos from the playlist.
 */
class DeleteVideoUi {
	// @param buttonId - the id for a button element
	// @param playlistUi - PlaylistUi to retrieve selection from
	constructor(buttonId, playlistUi) {		
		this.playlistUi = playlistUi;

		const buttonFunction = () => this.deleteVideo();
		this.button = new Listener(buttonId, buttonFunction);
	}

	// delete the selected entry in the video list
	deleteVideo() {
		// get selected video from Playlist UI.
		let id = this.playlistUi.getSelectedVideoId();

		// if no video selected, error
		if (id == null) {
			let message = "Can't delete a video unless a video is selected.";
			EventSystem.publishError(message);
			return;
		}

		// delete video from Playlist data.
		try {
			//this.playlistData.removeVideo(id);
			EventSystem.publish(
				"user.command.playlist.delete",
				{ id: id }
			);
		} catch (error) {
			let message = `Failed to delete video, something went wrong.`;
			EventSystem.publishError(message);
			return;
		}
	}
}

export default DeleteVideoUi;
