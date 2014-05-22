/*
 * loader.js
 *
 * @author	Freddy Garcia
 *
 * Uses PreloadJS to load necessary scripts for the application.
 * Creates global event listeners for the window.
 * Initializes the application.
 */

"use strict";

var app = app || {};

app.animationID = undefined;

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
	queue.loadFile("js/lib/FirstPersonControls.js");
	queue.loadFile("js/lib/dat.gui.js");
	queue.loadFile("js/utils/input.js");
	queue.loadFile("js/utils/ResourceManager.js");
	queue.loadFile("js/utils/SceneManager.js");
	queue.loadFile("js/utils/CameraManager.js");
	queue.loadFile("js/utils/utilities.js");
	queue.loadFile("js/core/Button.js");
	//queue.loadFile("js/core/moveLight.js");
	queue.loadFile("js/lizard.js");
	queue.loadFile("js/refraction.js");
	queue.loadFile("js/reflection.js");
	queue.loadFile("js/cameraTexture.js");
	queue.loadFile("js/water.js");
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
		Input.keyboard = new THREEx.KeyboardState();
		
		/*
		 * Callback for when the window goes out of focus.
		 * Cancels the animation callback
		 */
		 window.addEventListener('blur', function(){
			cancelAnimationFrame(app.animationID);
			
			// draw the updated screen
			app.main.render();
		 }, false);
		 
		 /*
		  * Callback for when the window comes back to focus.
		  * Calls the function containing RequestAnimationFrame
		  */
		 window.addEventListener('focus', function(){
			app.main.animate();
		 }, false);
		 
		 /*
		  * Callback for when the window is resized.
		  * Fixes the aspect ratio of the screen
		  */
		 window.addEventListener('resize', function(){
			app.main.resize();
		 }, false);
		 
		 /*
		  * Callback for when the mouse is moved.
		  * Updates the stored x/y positions in Input
		  */
		 window.addEventListener('mousemove', function(event){
			Input.updateMouse(event);
		 }, false);
		 
		 window.addEventListener('mousedown', function(event){
			app.main.onMouseDown(event);
		 }, false);
		 
		 // start the application
		 app.main.init();
	 };
}());