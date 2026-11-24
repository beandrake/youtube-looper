import EventSystem from './../common/EventSystem.js';
import Listener from './../common/Listener.js';

const MOVE_EARLIER = true;
const MOVE_LATER = false;
/**
 * ReorderVideoUi
 * The interface that shifts video order in the playlist.
 */
class ReorderVideoUi {
	// @param earlierButtonId - id of "move earlier" button element
	// @param laterButtonId - id of "move later" button element
	// @param playlistUi - PlaylistUi to retrieve selection from
	// @param treatListAsCircular - if true, videos moved past start/end loop to the other side
	constructor(earlierButtonId, laterButtonId,
				playlistUi, treatListAsCircular=true) {
		this.playlistUi = playlistUi;		
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
		const id = this.playlistUi.getSelectedVideoId();

		// if no video selected, error
		if (id == null) {
			let message = "Can't relocate a video unless a video is selected.";
			EventSystem.publishError(message);
			return;
		}

		// tell PlaylistData to shift video one spot in the desired direction
		try {
			var eventType = "user.command.playlist.move.";
			eventType += moveTowardsFront ? "earlier" : "later";
			const details = { id: id,  circular: this.treatListAsCircular};
			EventSystem.publish(eventType, details);
		} catch (error) {
			let message = `Failed to move video, something went wrong.`;
			EventSystem.publishError(message);
			return;
		}
	}
}

export default ReorderVideoUi;
