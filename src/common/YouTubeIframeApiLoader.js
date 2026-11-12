
/**
 * YouTubeIframeApiLoader
 * Manages the dynamic loading of the YouTube IFrame API and when loaded
 * invokes any callbacks received.
 * 
 * To use, just pass callMyCallbackWhenApiIsReady() a callback; whenever the
 * API finishes loading, your callback will be invoked.
 */
class YouTubeIframeApiLoader {

	static apiReady = false;
	static apiLoadStarted = false;
	static waitingToInitializeList = [];
	

	// Schedules initialization of callback depending on API readiness.
	// @param callback - When the API is ready, this function will be called.
	static callMyCallbackWhenApiIsReady(callback) {		
		// YouTube IFrame API needs to be dynamically loaded from web endpoint.
		if (YouTubeIframeApiLoader.apiReady) {
			// If API is already ready, our new instance can get started now.
			//console.log("Starting immediately.");
			callback();
		} else {
			// If API isn't ready, put this instance in a wait list; when the
			// API is ready we'll tell them all to initialize.
			YouTubeIframeApiLoader.waitingToInitializeList.push(callback);
			
			// ...and start loading the API if we were the first one.
			if (!YouTubeIframeApiLoader.apiLoadStarted) {
				YouTubeIframeApiLoader._startLoadingApi();
			}
		}
	}


	// Dynamically load YouTube IFrame API.
	static _startLoadingApi() {
		YouTubeIframeApiLoader.apiLoadStarted = true;
		// create new disembodied script element
		var apiScript = document.createElement('script');
		apiScript.src = "https://www.youtube.com/iframe_api";
		// insert script element into the DOM, which will start loading it
		let firstDomScript = document.getElementsByTagName('script')[0];
		firstDomScript.parentNode.insertBefore(apiScript, firstDomScript);

		// When the API is ready it calls this global function.
		window.onYouTubeIframeAPIReady = () => {
			//Log.toConsole("YouTube IFrame Player API loaded.");
			YouTubeIframeApiLoader.apiReady = true;
			YouTubeIframeApiLoader._initializeWaitingInstances();
		}
	}
	
	
	// Kicks off initialization of any callbacks waiting for the API to load.
	static _initializeWaitingInstances() {
		for (let callback of YouTubeIframeApiLoader.waitingToInitializeList) {
			//console.log("Starting from wait list.");
			callback();
		}
		YouTubeIframeApiLoader.waitingToInitializeList = [];
	}

}

export default YouTubeIframeApiLoader;