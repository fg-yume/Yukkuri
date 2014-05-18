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
	"REFLECTION": 5
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
	intersectOBJ	: undefined,
	intersectOO		: undefined,
	testColor		: {"original": 0xff9fff, "hover": 0x33DDF1},
	
	/*
	 * Updates the renderer and camera properties to match the new width and height values of the window
	 *
	 * @return	none
	 */
	resize : function()
	{	
		// camera
		CameraManager.getCamera("perspective").aspect = window.innerWidth / window.innerHeight;
		CameraManager.getCamera("perspective").updateProjectionMatrix();
	
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
		
		CameraManager.addCamera(camera, "perspective");
		CameraManager.addCamera(cameraOrtho, "orthographic");
		CameraManager.activateCamera("perspective");
		
		// Test!
		if(CameraManager.addCamera(camera, "Perspective"))
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
		var test_diffuse = new THREE.ImageUtils.loadTexture("resources/lizard/textures/ground_normal.png");
		
		var test_material = new THREE.SpriteMaterial({color: this.testColor.original});
		
		this.sprite = new THREE.Sprite(test_material);
		this.sprite.position.set(100, -200, -5);
		//sprite.position.normalize(); // not sure why
		this.sprite.scale.set(100, 100, 1.0);
		
		var sphere_mat = new THREE.MeshBasicMaterial({color: 0x0F0FF0});
		var sphere_geo = new THREE.SphereGeometry(5, 10, 10);
		
		this.sphere_mesh = new THREE.Mesh(sphere_geo, sphere_mat);
		
		//this.scene.add(this.sphere_mesh);
		//this.sceneOrtho.add(this.sprite);
		//this.scene.add(sprite);
		SceneManager.addToScene(this.sphere_mesh, "perspective");
		SceneManager.addToScene(this.sprite, "orthographic");
		
		this.animate();
	},
	
	onMouseDown : function()
	{
		if(this.currentState == app.STATE.MAIN)
		{
			// have to be hovering above our "button"
			if(this.intersectOO)
			{
				this.intersect00 = null;
			
				console.log("going to lizard!");
				this.changeGameState(app.STATE.LIZARD);
				
				// remove items from scene
				if(SceneManager.removeFromScene(this.sphere_mesh, "perspective"))
					console.log("proper remove from perspective");
					
				else
					console.log("not proper remove from perspective!");
				
				if(SceneManager.removeFromScene(this.sprite, "orthographic"))
					console.log("proper remove from ortho");
					
				else
					console.log("not proper remove from ortho!");
				
				// begin lizard
				app.lizard.init();	
			}
			
			if(this.intersectOBJ)
			{
				this.intersectOBJ = null;
				
				console.log("going to refraction!");
				this.changeGameState(app.STATE.REFRACTION);
				
				// remove items from scene
				if(SceneManager.removeFromScene(this.sphere_mesh, "perspective"))
					console.log("proper remove from perspective");
					
				else
					console.log("not proper remove from perspective!");
				
				if(SceneManager.removeFromScene(this.sprite, "orthographic"))
					console.log("proper remove from ortho");
					
				else
					console.log("not proper remove from ortho!");
					
				// begin refraction
				app.refraction.init();
			}
		}
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
			
			// Perspective Camera -----------------------------------------
			var vector = new THREE.Vector3(Input.mouseX, Input.mouseY, 1.0);
			this.projector.unprojectVector(vector, CameraManager.getCamera("perspective"));
			
			//console.log("mpos: " + Input.mouseX + ", " + Input.mouseY);
			
			var ray = new THREE.Raycaster(CameraManager.getCamera("perspective").position, vector.sub(CameraManager.getCamera("perspective").position).normalize());
			
			// grab the list of objects that intersect with the ray
			var intersects = ray.intersectObjects(SceneManager.getScene("perspective").children);
			
			// if we have intersections
			if(intersects.length > 0)
			{
				//console.log("no-ortho intersects");
				
				if(this.intersectOBJ != intersects[0].object)
				{
					// revert previously intersected object
					if(this.intersectOBJ)
					{
						this.intersectOBJ.material.color.setHex(this.testColor.original);
					}
						
					// change new intersected object
					this.intersectOBJ = intersects[0].object;
					this.intersectOBJ.material.color.setHex(this.testColor.hover);
				}
			}
			
			// reset previous intersection otherwise
			else
			{
				if(this.intersectOBJ)
					this.intersectOBJ.material.color.setHex(this.testColor.original);
					
				this.intersectOBJ = null;
			}
			
			// Orthographic camera ----------------------------------------
			vector = new THREE.Vector3(Input.mouseX, Input.mouseY * - 1, 0.5);
			
			ray = this.projector.pickingRay(vector, CameraManager.getCamera("orthographic"));
			
			intersects = ray.intersectObjects(SceneManager.getScene("orthographic").children);
			if(intersects.length > 0)
			{
				//console.log("ortho intersect");
				
				if(this.intersectOO != intersects[0].object)
				{
					// revert previously intersected object
					if(this.intersectOO)
					{
						this.intersectOO.material.color.setHex(this.testColor.original);
					}
						
					// change new intersected object
					this.intersectOO = intersects[0].object;
					this.intersectOO.material.color.setHex(this.testColor.hover);
				}
			}
			
			else
			{
				if(this.intersectOO)
					this.intersectOO.material.color.setHex(this.testColor.original);
					
				this.intersectOO = null;
			}
			
			break;
				
		case app.STATE.LIZARD:
			
			if(app.lizard.ready)
				app.lizard.update();
				
			break;
			
		case app.STATE.REFRACTION:
			
			if(app.refraction.ready)
				app.refraction.update();
		
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
			CameraManager.activateCamera("perspective");
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
		this.animationID = requestAnimationFrame(this.animate.bind(this));
		
		this.update();
		this.render();
	}
};