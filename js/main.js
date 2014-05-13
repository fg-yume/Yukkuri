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
	"WATER"		: 3
};

app.main = {
	// Constants ------------------------------------------------------------
	CAMERA_NEAR_PLANE	: 1,	// near clipping plane for camera frustum
	CAMERA_FAR_PLANE	: 5000, // far clipping plane for camera frustum
	FOV_VERTICAL		: 75,	// vertical field of view for camera frustum
	
	// Variables ------------------------------------------------------------
	scene			: undefined,	  // threejs scene that will contain all objects to be rendered
	sceneOrtho		: undefined,	  // threejs scene that will contain all HUD elements to be rendered
	renderer		: undefined,	  // threejs renderer that handles rendering the scene
	camera			: undefined,	  // main threejs camera for viewing the scene
	cameraOrtho		: undefined,	  // main orthographic camera for viewing the scene
	projector		: undefined,	  // 
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
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		
		this.cameraOrtho.left	= window.innerWidth / -2;
		this.cameraOrtho.right	= window.innerWidth / 2;
		this.cameraOrtho.top	= window.innerHeight / 2;
		this.cameraOrtho.bottom	= window.innerHeight / -2;
		
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
		// scene
		this.scene		= new THREE.Scene();
		this.sceneOrtho	= new THREE.Scene();
		
		// camera
		this.camera = new THREE.PerspectiveCamera(this.FOV_VERTICAL, window.innerWidth / window.innerHeight, this.CAMERA_NEAR_PLANE, this.CAMERA_FAR_PLANE);
		
		this.camera.position.y = 40;
		this.camera.position.z = 30;
		
		this.cameraOrtho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, this.CAMERA_NEAR_PLANE, this.CAMERA_FAR_PLANE);
		
		this.cameraOrtho.position.z = 10;
		
		// renderer
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
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
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
		
		this.scene.add(this.sphere_mesh);
		this.sceneOrtho.add(this.sprite);
		//this.scene.add(sprite);
		
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
			
				console.log("clicked!");
				this.changeGameState(app.STATE.LIZARD);
				
				this.scene.remove(this.sphere_mesh);
				this.sceneOrtho.remove(this.sprite);
				
				lizard.main.init();	
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
			this.projector.unprojectVector(vector, this.camera);
			
			//console.log("mpos: " + Input.mouseX + ", " + Input.mouseY);
			
			var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
			
			// grab the list of objects that intersect with the ray
			var intersects = ray.intersectObjects(this.scene.children);
			
			// if we have intersections
			if(intersects.length > 0)
			{
				console.log("no-ortho intersects");
				
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
			
			ray = this.projector.pickingRay(vector, this.cameraOrtho);
			
			intersects = ray.intersectObjects(this.sceneOrtho.children);
			if(intersects.length > 0)
			{
				console.log("ortho intersect");
				
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
			
			if(lizard.main.ready)
				lizard.main.update();
				
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
			this.renderer.render(this.scene, this.camera);	
			
			// HUD & buttons
			this.renderer.clearDepth();
			this.renderer.render(this.sceneOrtho, this.cameraOrtho);
			
			break;
			
		case app.STATE.LIZARD:
			
			if(lizard.main.ready)
				lizard.main.render();
			
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