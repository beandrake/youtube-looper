/**
 * ReorderVideoUi
 * The interface that shifts video position in the playlist.
 */
class ReorderVideoUi {
	// @param upButtonId - the id for the up button element
	// @param downButtonId - the id for the down button element
	// @param playlistData - PlaylistData to delete from
	// @param playlistUi - PlaylistUi to retrieve selection from
	// @param errorUi - ErrorUi to send errors to.
	// @param treatListAsCircular - if true, videos moved past start/end loop to the other side
	constructor(upButtonId, downButtonId,
				playlistData, playlistUi, errorUi, treatListAsCircular=true) {
		this.upButton = document.getElementById(upButtonId);
		this.downButton = document.getElementById(downButtonId);
		
		this.treatListAsCircular = treatListAsCircular;

		this.playlistData = playlistData;
		this.playlistUi = playlistUi;
		this.errorUi = errorUi;

		this.startListeners();
	}

	// Shift selected video's position in the list.
	// @param moveTowardsFront - which directi
	shiftVideo(moveTowardsFront) {
		// get selected video from Playlist UI.
		const index = this.playlistUi.getSelectedVideoIndex();

		// if no video selected, error
		if (index == null) {
			let message = "Can't relocate a video unless a video is selected.";
			this.errorUi.displayError(message);
			return;
		}

		// tell PlaylistData to shift video one spot in the desired direction
		try {
			if (moveTowardsFront) {
				this.playlistData.shiftVideoEarlier(index, this.treatListAsCircular);
			} else {
				this.playlistData.shiftVideoLater(index, this.treatListAsCircular);
			}
		} catch (error) {
			let message = `Failed to move video, something went wrong.`;
			this.errorUi.displayError(messsage);
			return;
		}
	}


	// Setup button listeners.
	startListeners() {
		// When the listener calls our function, "this" won't be this object.
		// So when creating the listener, we save a reference to this as self.
		var self = this;
		this.upButton.addEventListener(
			'click',
			() => {
				const moveTowardsFront = true;
				self.shiftVideo(moveTowardsFront);
			}
		);
		this.downButton.addEventListener(
			'click',
			() => {
				const moveTowardsFront = false;
				self.shiftVideo(moveTowardsFront);
			}
		);
	}

}

export default ReorderVideoUi;
