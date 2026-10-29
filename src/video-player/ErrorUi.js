import Listener from './common/Listener.js';

/**
 * ErrorUi
 * Controls a text element to display error messages on
 * and a button to clear them.
*/
class ErrorUi {
	// @param textId - id for an element with innerText (such as <p>).
	// @param buttonId - the id for a button element
	constructor(textId, buttonId) {
		this.errorMessageElement = document.getElementById(textId);
		this.clearErrorButton = document.getElementById(buttonId);
		this.clearError();

		const callback = () => this.clearError();
		this.buttonListener = new Listener(buttonId, callback);
	}

	// Display an error message and a button to clear the error message.
	// @param error - either a string message or an Error object
	displayError = (error) => {
		const message = error instanceof Error ? error.message : error;
		// construct error text with timestamp
		const now = new Date();
		const timestamp = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		const outputText = timestamp + " ERROR: " + message;
		// display error text
		this.errorMessageElement.innerText = outputText;
		this.errorMessageElement.style.display = "inline-block";
		// reveal clear error button
		this.clearErrorButton.style.display = "inline";
	}

	// Clear the error text and hide the button
	clearError = () => {
		this.errorMessageElement.innerText = "";
		this.errorMessageElement.style.display = "none";
		this.clearErrorButton.style.display = "none";
	}
}

export default ErrorUi;