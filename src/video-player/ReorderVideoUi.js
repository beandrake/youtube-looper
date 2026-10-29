import Listener from './common/Listener.js';

const MOVE_EARLIER = true;
const MOVE_LATER = false;
/**
 * ReorderVideoUi
 * The interface that shifts video position in the playlist.
 */
class ReorderVideoUi {
	// @param earlierButtonId - id of "move earlier" button element
	// @param laterButtonId - id of "move later" button element
	// @param playlistData - PlaylistData to delete from
	// @param playlistUi - PlaylistUi to retrieve selection from
	// @param errorUi - ErrorUi to send errors to.
	// @param treatListAsCircular - if true, videos moved past start/end loop to the other side
	constructor(earlierButtonId, laterButtonId,
				playlistData, playlistUi, errorUi, treatListAsCircular=true) {
		this.playlistData = playlistData;
		this.playlistUi = playlistUi;
		this.errorUi = errorUi;
		
		this.treatListAsCircular = treatListAsCircular;

		const moveEarlierFunction = () => this.shiftVideo(MOVE_EARLIER);
		this.earlierButton = new Listener(earlierButtonId, moveEarlierFunction);

		const moveLaterFunction = () => this.shiftVideo(MOVE_LATER);
		this.laterButton = new Listener(laterButtonId, moveLaterFunction);
	}

	// Shift selected video's position in the list.
	// @param moveTowardsFront - if true shifts earlier, otherwise shifts later
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
			this.errorUi.displayError(message);
			return;
		}
	}
}

export default ReorderVideoUi;
