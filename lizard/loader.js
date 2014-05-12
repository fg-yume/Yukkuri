/*
 * loader.js
 *
 * @author	Freddy Garcia
 *
 * Uses PreloadJS to load necessary files for the application.
 * Creates global event listeners for the window.
 * Initializes the application.
 */

"use strict";

var lizard = lizard || {};

lizard.animationID = undefined;

// entry point
(function(){
	// PreloadJS queue
	var queue = new createjs.LoadQueue(false);
	
	queue.on("complete", onComplete, this);
	
	// load files
	queue.loadFile("js/lib/three.min.js");
	queue.loadFile("js/lib/threex.keyboardstate.js");
	queue.loadFile("js/lib/Detector.js");
	queue.loadFile("js/lib/OrbitControls.js");
	queue.loadFile("js/utils/resources.js");
	queue.loadFile("js/core/moveLight.js");
	queue.loadFile("js/main.js");
	
	/*
	 * Callback for when all files have finished loading.
	 * Sets up event listeners for window and input.
	 *
	 * @param	{Event} event	the event object to handle
	 *
	 * @return	none 
	 */
	function onComplete(event)
	{
		// Keyboard events
		lizard.keyboard = new THREEx.KeyboardState();
	
		/*
		 * Callback for when the window goes out of focus.
		 * Cancels the animation callback.
		 *
		 */
		window.addEventListener('blur', function(){
			cancelAnimationFrame(lizard.animationID);
		}, false);
		
		/*
		 * Callback for when the window comes back to focus.
		 * Calls the function containing RequestAnimationFrame
		 *
		 */
		window.addEventListener('focus', function(){
			lizard.main.loop();
		}, false);
		
		lizard.main.init();
	}
}());