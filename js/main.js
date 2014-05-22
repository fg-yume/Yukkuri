/*
 * main.js
 *
 * @author	Freddy Garcia
 *
 * Handles setting up three.js as well as the main framework for the
 * application. 
 */
 
"use strict";

var app = app || {};

// Globals -----------------------------------------------------
app.STATE = {
	"MAIN" 		: 0,
	"LOADING"	: 1,
	"LIZARD"	: 2,
	"REFRACTION": 3,
	"WATER"     : 4,
	"REFLECTION": 5,
	"CAMERA"	: 6,
	"PAUSED"	: 7,
};

app.main = {
	// Constants ------------------------------------------------------------
	CAMERA_NEAR_PLANE	: 1,	// near clipping plane for camera frustum
	CAMERA_FAR_PLANE	: 5000, // far clipping plane for camera frustum
	FOV_VERTICAL		: 75,	// vertical field of view for camera frustum
	
	// Variables ------------------------------------------------------------
	renderer		: undefined,	  // threejs renderer that handles rendering the scene
	projector		: undefined,	  // handles raycasting
	controls		: undefined, 	  // camera controls for the scene
	currentState	: app.STATE.MAIN, // current state of the application
	previousState	: app.STATE.MAIN, // previous state of the application
	intersectOO		: undefined,      // the button being hovered
	buttons			: new Array(),    // holds all of the buttons that will lead to the various experiences	
	
	sound1			: undefined,
	
	/*
	 * Updates the renderer and camera properties to match the new width and height values of the window
	 *
	 * TODO: Handle all possible cameras!
	 *
	 * @return	none
	 */
	resize : function()
	{	
		// camera
		CameraManager.getCamera("perspective_OC").aspect = window.innerWidth / window.innerHeight;
		CameraManager.getCamera("perspective_OC").updateProjectionMatrix();
	
		CameraManager.getCamera("orthographic").left	= window.innerWidth / -2;
		CameraManager.getCamera("orthographic").right	= window.innerWidth / 2;
		CameraManager.getCamera("orthographic").top	= window.innerHeight / 2;
		CameraManager.getCamera("orthographic").bottom	= window.innerHeight / -2;
		
		// renderer
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	},
	
	changeGameState : function(newState)
	{
		this.previousState = this.currentState;
		this.currentState = newState;
	},
	
	/*
	 * Calls functions that will create the necessary threejs components
	 *
	 * @return	none
	 */
	init : function()
	{
		this.initThree();
		this.createWorld();
	},
	
	/*
	 * Initializes necessary elements for threejs functionality
	 *
	 * @return	none
	 */
	initThree : function()
	{
		// Scene --------------------------------------------------------
		var scene		= new THREE.Scene();
		var sceneOrtho	= new THREE.Scene();
		
		SceneManager.addScene(scene, "perspective");
		SceneManager.addScene(sceneOrtho,"orthographic");
		SceneManager.activateScene("perspective");
		
		// test!
		if(SceneManager.addScene(scene, "Perspective"))
			console.log("This should not happen!");
		else
			console.log("this should happen!");
		
		// Camera --------------------------------------------------------
		var camera = new THREE.PerspectiveCamera(this.FOV_VERTICAL, window.innerWidth / window.innerHeight, this.CAMERA_NEAR_PLANE, this.CAMERA_FAR_PLANE);
		
		camera.position.y = 40;
		camera.position.z = 30;
		
		var cameraOrtho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, this.CAMERA_NEAR_PLANE, this.CAMERA_FAR_PLANE);
		
		cameraOrtho.position.z = 10;
		
		CameraManager.addCamera(camera, "perspective_OC");
		CameraManager.addCamera(cameraOrtho, "orthographic");
		CameraManager.activateCamera("perspective_OC");
		
		// Test!
		if(CameraManager.addCamera(camera, "perspective_OC"))
			console.log("this should not happen!");
		else
			console.log("this should happen!");
		
		// Renderer -------------------------------------------------------
		if(Detector.webgl)
			this.renderer = new THREE.WebGLRenderer({antialias: true});
		else
			this.renderer = new THREE.CanvasRenderer();
			
		this.renderer.setClearColor(0x000000);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMapEnabled	= true;
		this.renderer.shadowMapSoft		= true;
		this.renderer.autoClear			= false; // to allow render overlay
		
		// projector
		this.projector	= new THREE.Projector();
		
		// attaching to page
		document.body.appendChild(this.renderer.domElement);
		
		// control type
		this.controls = new THREE.OrbitControls(CameraManager.getCamera(), this.renderer.domElement);
	},
	
	/*
	 * Creates the objects that will be put in the scene
	 *
	 * @return	none
	 */
	createWorld : function()
	{
		// Objects ---------------------------------------------------
		var prop_lizard = {
			center : {x: 50, y: -100, z: -5},
			size   : {height: 100, width: 100, depth: 1},
			color  : {main: "0x33AABB", hover: "0x33BBFF", click: "0x99BBFF"},
			id     : "button_lizard",
			click_callback : function(){
				this.changeState(BUTTON_STATE.CLICK); // should be "button" this
				
				app.main.unload();
				app.main.changeGameState(app.STATE.LIZARD);
				app.lizard.init();
			},
			hover_callback : function(){
				this.changeState(BUTTON_STATE.HOVER); // should be "button" this
			}
		};
		
		var prop_water = {
			center : {x: 50, y: -250, z: -5},
			size   : {height: 100, width: 100, depth: 1},
			color  : {main: "0xBB3DAC", hover: "0xFF3DAC", click: "0x99BBFF"},
			id     : "button_water",
			click_callback : function(){
				this.changeState(BUTTON_STATE.CLICK); // will map to app.Button.Button
				
				app.main.unload();
				app.main.changeGameState(app.STATE.WATER);
				app.water.init();
			},
			hover_callback : function(){
				this.changeState(BUTTON_STATE.HOVER); // will map to app.Button.Button
			}
		};
		
		var prop_refrac = {
			center : {x: -100, y: -250, z: -5},
			size   : {height: 100, width: 100, depth: 1},
			color  : {main: "0x5500FF", hover: "0x5555FF", click: "0x99BBFF"},
			id     : "button_refrac",
			click_callback : function(){
				this.changeState(BUTTON_STATE.CLICK); // will map to app.Button.Button
				
				app.main.unload();
				app.main.changeGameState(app.STATE.REFRACTION);
				app.refraction.init();
			},
			hover_callback : function(){
				this.changeState(BUTTON_STATE.HOVER); // will map to app.Button.Button
			}
		};
		
		var prop_camera = {
			center : {x: -100, y: 50, z: -5},
			size   : {height: 100, width: 100, depth: 1},
			color  : {main: "0x0055FF", hover: "0x5555FF", click: "0x99BBFF"},
			id     : "button_camera",
			click_callback : function(){
				this.changeState(BUTTON_STATE.CLICK); // will map to app.Button.Button
				
				app.main.unload();
				app.main.changeGameState(app.STATE.CAMERA);
				app.cameraTexture.init();
			},
			hover_callback : function(){
				this.changeState(BUTTON_STATE.HOVER); // will map to app.Button.Button
			}
		};
		
		var prop_reflec = {
			center : {x: -100, y: -100, z: -5},
			size   : {height: 100, width: 100, depth: 1},
			color  : {main: "0xDD1199", hover: "0xDDFF99", click: "0x99BBFF"},
			id     : "button_reflec",
			click_callback : function(){
				this.changeState(BUTTON_STATE.CLICK); // will map to app.Button.Button
				
				app.main.unload();
				app.main.changeGameState(app.STATE.REFLECTION);
				app.reflection.init();
			},
			hover_callback : function(){
				this.changeState(BUTTON_STATE.HOVER); // will map to app.Button.Button
			}
		};
		
		var Sound = function ( sources, radius, volume ) {

			var audio = document.createElement( 'audio' );

			for ( var i = 0; i < sources.length; i ++ ) {

				var source = document.createElement( 'source' );
				source.src = sources[ i ];

				audio.appendChild( source );

			}

			this.position = new THREE.Vector3();

			this.play = function () {

				audio.play();

			}

			this.update = function ( camera ) {

				var distance = this.position.distanceTo( camera.position );

				if ( distance <= radius ) {

					audio.volume = volume * ( 1 - distance / radius );

				} else {

					audio.volume = 0;

				}

			}

		};
		
		this.sound1 = new Sound( [ 'resources/sound/beep.mp3', 'resources/sound/beep.ogg' ], 1, 0.01 );
		
		
		var sprite_lizard = new app.Button(prop_lizard);
		var sprite_water  = new app.Button(prop_water);
		var sprite_refrac = new app.Button(prop_refrac);
		var sprite_reflec = new app.Button(prop_reflec);
		var sprite_camera = new app.Button(prop_camera);
		
		this.buttons.push(sprite_lizard);
		this.buttons.push(sprite_water);
		this.buttons.push(sprite_refrac);
		this.buttons.push(sprite_reflec);
		//this.buttons.push(sprite_camera);
		
		// Scene Additions ---------------------------------------------
		SceneManager.addToScene(sprite_lizard.getMesh(), "orthographic");
		SceneManager.addToScene(sprite_water.getMesh(), "orthographic");
		SceneManager.addToScene(sprite_refrac.getMesh(), "orthographic");
		SceneManager.addToScene(sprite_reflec.getMesh(), "orthographic");
		SceneManager.addToScene(sprite_camera.getMesh(), "orthographic");
		
		this.animate();
	},
	
	onMouseDown : function()
	{
		this.sound1.play();
		if(this.currentState == app.STATE.MAIN)
		{
			// have to be hovering above our "button"
			
			if(this.intersectOO)
			{
				// check button array
				for(var i = 0; i < this.buttons.length; i++)
				{
					if(this.intersectOO == this.buttons[i].mesh)
						this.buttons[i].click_callback();
				}
				
				this.intersectOO = null;
			
				console.log("button click!");
			}
		}
	},
	
	/*
	 * Removes all elements in this screen from the THREE.Scene
	 *
	 * @return  none
	 */
	unload : function()
	{
		// remove buttons from scene
		for(var i = 0; i < this.buttons.length; i++)
			SceneManager.removeFromScene(this.buttons[i].mesh, "orthographic");
	},
	
	/*
	 * Updates the scene based on the current state
	 *
	 * @return	none
	 */
	update : function()
	{
		switch(this.currentState)
		{
		case app.STATE.MAIN:
			this.controls.update(1/60);
			
			// Orthographic camera ----------------------------------------
			var vector = new THREE.Vector3(Input.mouseX, Input.mouseY * - 1, 0.5);
			
			var ray = this.projector.pickingRay(vector, CameraManager.getCamera("orthographic"));
			
			var intersects = ray.intersectObjects(SceneManager.getScene("orthographic").children);
			
			// orthographic intersections
			if(intersects.length > 0)
			{
				// if intersecting object is different from previous frame
				if(this.intersectOO != intersects[0].object)
				{
					// revert previously intersected object
					for(var i = 0; i < this.buttons.length; i++)
					{
						if(this.intersectOO == this.buttons[i].mesh)
							this.buttons[i].changeState(BUTTON_STATE.MAIN);
					}
						
					// change new intersected object
					this.intersectOO = intersects[0].object;
					
					for(var i = 0; i < this.buttons.length; i++)
					{
						if(this.intersectOO == this.buttons[i].mesh)
							this.buttons[i].hover_callback();
					}
				}
			}
			
			// no orthographic intersections
			else
			{
				// if there was previously an intersection
				if(this.intersectOO)
				{
					// revert to normal
					for(var i = 0; i < this.buttons.length; i++)
					{
						if(this.intersectOO == this.buttons[i].mesh)
							this.buttons[i].changeState(BUTTON_STATE.MAIN);
					}
				}
					
				this.intersectOO = null;
			}
			
			// update buttons
			for(var i = 0; i < this.buttons.length; i++)
				this.buttons[i].update();
			
			break;
				
		case app.STATE.LIZARD:
			
			if(app.lizard.ready)
				app.lizard.update();
				
			break;
			
		case app.STATE.REFRACTION:
			
			if(app.refraction.ready)
				app.refraction.update();
		
			break;
			
		case app.STATE.REFLECTION:
		
			if(app.reflection.ready)
				app.reflection.update();
				
			break;
			
		case app.STATE.CAMERA:
		
			if(app.cameraTexture.ready)
				app.cameraTexture.update();
				
			break;
			
		case app.STATE.WATER:
		
			if(app.water.ready)
				app.water.update();
		
			break;
			
		case app.STATE.PAUSED:
		
			// do nothing
			break;
				
		default:
			break;
		}
	},
	
	/*
	 * Renders the scene based on the current frame
	 *
	 * @return	none
	 */
	render : function()
	{
		switch(this.currentState)
		{
		case app.STATE.MAIN:
		
			// regular pass
			this.renderer.clear();
			SceneManager.activateScene("perspective");
			CameraManager.activateCamera("perspective_OC");
			this.renderer.render(SceneManager.getScene(), CameraManager.getCamera());	
			
			// HUD & buttons
			this.renderer.clearDepth();
			SceneManager.activateScene("orthographic");
			CameraManager.activateCamera("orthographic");
			this.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
			
			break;
			
		case app.STATE.LIZARD:
			
			if(app.lizard.ready)
			{
				this.renderer.clear();
				app.lizard.render();
			}
			
			break;
			
		case app.STATE.REFRACTION:
		
			if(app.refraction.ready)
			{
				this.renderer.clear();
				app.refraction.render();
			}
			
			break;
			
		case app.STATE.REFLECTION:
		
			if(app.reflection.ready)
			{
				this.renderer.clear();
				app.reflection.render();
			}
		
			break;
			
		case app.STATE.CAMERA:
		
			if(app.cameraTexture.ready)
			{
				this.renderer.clear();
				app.cameraTexture.render();
			}
		
			break;
			
		case app.STATE.WATER:
		
			if(app.water.ready)
			{
				this.renderer.clear();
				app.water.render();
			}
			
			break;
			
		case app.STATE.PAUSED:
		
			// do nothing
			break;
			
		default:
			break;
		}
	},
	
	/*
	 * Main loop for the program
	 *
	 * @return	none
	 */
	animate : function()
	{
		app.animationID = requestAnimationFrame(this.animate.bind(this));
		
		this.update();
		this.render();
	}
};