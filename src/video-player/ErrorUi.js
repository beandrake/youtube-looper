import Listener from './../common/Listener.js';

/**
 * ErrorUi
 * Controls a text element to display messages for the user
 * and a button to clear them.
*/
class ErrorUi {
	// @param textId - id for an element with innerText (such as <p>).
	// @param buttonId - the id for a button element
	constructor(textId, buttonId) {
		this.textElement = document.getElementById(textId);
		this.clearMessageButton = document.getElementById(buttonId);
		this.clearMessage();

		const callback = () => this.clearMessage();
		this.buttonListener = new Listener(buttonId, callback);
	}

	// Display an error message and a button to clear the error message.
	// @param error - either a string message or an Error object
	displayError = (error) => {
		const message = error instanceof Error ? error.message : error;
		// display error text
		this.textElement.innerText = message;
		this.textElement.style.display = "inline-block";
		// reveal clear error button
		this.clearMessageButton.style.display = "inline";
	}

	// Clear the error text and hide the button
	clearMessage = () => {
		this.textElement.innerText = "";
		this.textElement.style.display = "none";
		this.clearMessageButton.style.display = "none";
	}
}

export default ErrorUi;