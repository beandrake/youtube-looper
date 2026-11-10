// There are notes on the YouTube IFrame API at the bottom of this file.
import Log from './../utils/Log.js';

/**
 * YouTubeUi
 * Manages the embedded YouTube iframe that plays a video,
 * and provides an interface to control aspects of the player.
 */
class YouTubeUi {
	// @param iframeOrDivId - iframe to use, or div to replace with iframe
	// @param youtubeId - the id of a YouTube video to initially load
	// @param errorUi - ErrorUi to send errors to	
	constructor(iframeOrDivId, youtubeId, errorUi) {
		this.iframeOrDivId = iframeOrDivId;
		this.default_youtubeId = youtubeId;
		this.errorUi = errorUi;
		
		this.width = "560"
		this.height = "315"
		this.frameborder = "0"
		this.allowfullscreen = true;
	
		YouTubeUi._queueInitialization(this);
	}


	static apiReady = false;
	static apiLoadStarted = false;
	static waitingToInitializeList = [];
	
	// Schedules initialization of new instances depending on API readiness.
	static _queueInitialization(newInstance) {		
		// YouTube IFrame API needs to be dynamically loaded from web endpoint.
		if (YouTubeUi.apiReady) {
			// If API is already ready, our new instance can get started now.
			newInstance.initialize();
		} else {
			// If API isn't ready, put this instance in a wait list; when the
			// API is ready we'll tell them all to initialize.
			YouTubeUi.waitingToInitializeList.push(newInstance);
			
			// ...and start loading the API if nobody else has.
			if (!YouTubeUi.apiLoadStarted) {
				YouTubeUi.startLoadingApi();
			}
		}
	}

	// Dynamically load YouTube IFrame API.
	static startLoadingApi() {
		YouTubeUi.apiLoadStarted = true;
		// create new disembodied script element
		var apiScript = document.createElement('script');
		apiScript.src = "https://www.youtube.com/iframe_api";
		// insert script element into the DOM, which will start loading it
		let firstDomScript = document.getElementsByTagName('script')[0];
		firstDomScript.parentNode.insertBefore(apiScript, firstDomScript);

		// When the API is ready it calls this global function.
		window.onYouTubeIframeAPIReady = () => {
			//Log.toConsole("YouTube IFrame Player API loaded.");
			YouTubeUi.apiReady = true;
			YouTubeUi._initializeWaitingInstances();
		}
	}
	
	
	// Kicks off initialization of any instances waiting for the API to load.
	static _initializeWaitingInstances() {
		for (let instance of YouTubeUi.waitingToInitializeList) {
			instance.initialize();
		}
		YouTubeUi.waitingToInitializeList = [];
	}


	// Create our new YT.Player.
	initialize() {
		let settings = 	{
			height: this.height,
			width: this.width,
			videoId: this.default_youtubeId,
			// https://developers.google.com/youtube/player_parameters
			playerVars: {
				// don't default to full-screen on iOS
				'playsinline': 1,
				// The next two cause ONLY the first video to auto-loop.
				'playlist': this.default_youtubeId,
				'loop': 1,
			},
			events: {
				'onReady': (event) => this._onPlayerReady(event),
				'onStateChange': (event) => this._onPlayerStateChange(event)
			}
		};

		// After making YT.Player, leave it alone until onReady event!
		this.player = new YT.Player(this.iframeOrDivId, settings);		
	}

	
	// Called when the player is ready to use immediately after creation.
	_onPlayerReady(event) {
		//Log.toConsole("YT.Player object ready.");
	}

	
	// Called when the player's PlayerState changes.
	_onPlayerStateChange(event) {
		// Note that the flow of PlayerState isn't always intuitive, see notes
		// about PlayerState at page bottom of this file for details.

		//Log.toConsole( this._playerStateString(event.data) );

		if (event.data == YT.PlayerState.ENDED) {
			// If a video is ENDED, it is not looping.
			// So let's make it loop by telling it to play.
			this.player.playVideo();
		}
	}

	
	// Translates YT.PlayerState enum into human language.
	_playerStateString(value) {
		if (value == YT.PlayerState.ENDED) {
			return "ended";
		} else if (value == YT.PlayerState.PLAYING) {
			return "playing";
		} else if (value == YT.PlayerState.PAUSED) {
			return "paused";
		} else if (value == YT.PlayerState.BUFFERING) {
			return "buffering";		
		} else if (value == -1) { // -1 = UNSTARTED
			return "unstarted";
		} else if (value == YT.PlayerState.CUED) {
			return "queued";
		} else {
			throw new TypeError("Invalid value for PlayerState.");
		}
	}


	// Load the specified video into the player.
	// @param youtubeId - id of a YouTube video
	loadAndPlayVideo(youtubeId) {
		this.player.loadVideoById(youtubeId);
		//Log.toConsole(`loading ${this.default_youtubeId}...`);
	}


	// Attempts to mimic the functionality of YouTube's K hotkey,
	// pausing the video if it's playing, otherwise playing it.
	togglePlayAndPause() {
		// Note about edge cases:
		// This method tries to determine whether the player is paused or
		// playing by checking the player's PlayerState. Most of the time that
		// will be fine, but when a video is starting or restarting the
		// PlayerState can fluctuate between states, with a video that is
		// "playing" briefly entering PAUSED or UNSTARTED states. Additionally,
		// one method our code uses to loop videos is to respond to the ENDED
		// state, meaning that for a split-second the ENDED state is capable of
		// being detected as well.  For more details, see the notes at the
		// bottom of this file.
		// In the vast majority of cases, none of this will be an issue. The
		// worst case scenario the rest of the time is that the user will try
		// to play or pause, and it will seem like nothing happened, and then
		// their next input will work as expected.
		// I'm going to keep my eye out for more reliable options, but I would
		// rather this feature exist and be imperfect than not exist at all.
		const currentState = this.player.getPlayerState();
		const playStates = [YT.PlayerState.BUFFERING, YT.PlayerState.PLAYING];
		if ( playStates.includes(currentState) ) {
			////Log.toConsole(`COMMAND: PAUSE`);
			this.player.pauseVideo();
		} else {
			////Log.toConsole(`COMMAND: PLAY`);
			this.player.playVideo();
		}
	}

}


export default YouTubeUi;
/*
	-----------------------------	
	Notes
	-----------------------------

	The documentation for the YouTube IFrame API is helpful but sometimes
	lacking in details, and there are some aspects of the player's
	functionality that have not quite worked the way I expected them to. For
	that reason, getting the player to work the way I wanted it to has taken
	a good deal of experimentation. To hopefully mitigate needing to repeat the
	same experiments, I'm recording notes about what I've learned here. If
	you're ever making modifications and not quite getting the results you're
	after, it may be a good idea to check down here to avoid reinventing the
	wheel.
	
	------------------------------

	Creating the player

		When creating a new YT.Player object, the first parameter it needs is
		the id for a div or an iframe.
		
		If you go the div route, the API just replaces your the div with a
		canned iframe. This iframe will have all the properties needed to
		function with the API, and probably some that you don't need or want
		as well. One benefit of the canned iframe is that the API will
		automatically populate the origin parameter in the URLs to match the
		source you are running on, which is convenient because it works in
		both prod and dev without any tinkering on your part.
		
		If you go the iframe route, you get to better customize your iframe,
		but you're responsible for making sure it has all the needed properties
		and attributes, otherwise some functionality may not work. Below is the
		minimum that I've been using, but note that it does NOT include the
		include the origin property in the URL, which has security benefits):

		id="youtube-frame" type="text/html"
		width="560" height="315"
		frameborder="0"	allowfullscreen referrerpolicy="strict-origin"
		allow="autoplay; encrypted-media; clipboard-write"
		src="https://www.youtube-nocookie.com/embed/SRczGJ-4M5g?playlist=SRczGJ-4M5g&loop=1&enablejsapi=1"

		...also note that if you start with a pre-existing iframe, some of the
		settings you initialize the player with don't seem to function; the
		documentation mentions that width and height will be ignored, but I
		also found that the video specified in the constructor will not
		overwrite whatever was specified in the original HTML.  However, it is
		possible to load new videos afterwards via loadVideoById().


	Looping
		
		The very first video's looping works differently than any videos that
		get	loaded later on.
		
		If you used a div to create your YT.Player, using
		these two settings in playerVars...
			'playlist': SAME_ID_AS_YOUR_VIDEO,
			'loop': 1,
		...will make the first video loop.

		However, if you used a pre-existing iframe, then the first video
		seems unaffected by these variables; instead, it will either loop or
		not depending on whether those variables are setup correctly in the
		actual URL of the iframe.

		Regardless of how you setup the first video, any videos loaded later
		via loadVideoById() will not loop without further action; they seem
		to ignore the loop-related playerVars. Additionally, using the method
		setLoop(true) also seems to do nothing.

		So to loop, I've just been responding to the ENDED PlayerState with
		a call to playVideo().
	

	PlayerState
	
		I did some testing to see how the YT.Player's PlayerState flowed in and
		out of different states. Some of the results were unexpected, so I'm
		documenting them here.

		These tests were confirmed to be consisten regardless of whether using
		a pre-existing iframe or div:
		
			A video that is loaded by default - whether using the loop behavior
			from the URL in a pre-existing iframe or using a div with the
			loop-related playerVars - will restart by transitioning from
			PLAYING to UNSTARTED -> BUFFERING -> PLAYING. It won't ever be in
			the ENDED state.

			Starting a new video in the list will go from PLAYING to
			PAUSED -> UNSTARTED -> BUFFERING -> PLAYING.

			When a new video repeats by responding to ENDED with playVideo(),
			it will do PLAYING -> BUFFERING -> PLAYING.

		This unfortunately means that simply checking the PlayerState can't be
		100% relied upon to easily detect whether the player is paused or
		playing, since both PAUSED and UNSTARTED can both be briefly detected
		while the player's last given input was to play a video.

	
*/