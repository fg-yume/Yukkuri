/*
 * main.js
 *
 * @author	Freddy Garcia
 *
 * Handles setting up three.js and loading necessary assets
 */
 
"use strict";

var lizard = lizard || {};

// Lizard Globals -------------------------------------------------------------------------
lizard.WIDTH		= window.innerWidth; 			// width that the canvas will take up
lizard.HEIGHT		= window.innerHeight;			// height that the canvas will take up
lizard.ASPECT_RATIO	= lizard.WIDTH / lizard.HEIGHT; // aspect ratio for the threejs camera

lizard.main = {
	testStep	: 0,
	ready		: false,

	/*
	 * Calls functions that will create the necessary threejs components and 
	 * load necessary assets
	 *
	 * @return	none
	 */
	init : function()
	{
		console.log("lizard entry!");
	
		//this.initThree();
		this.loadAndCreateAssets();
	},
	
	/*
	 * Loads any additional assets for the scene
	 *
	 * @return	none
	 */
	loadAndCreateAssets : function()
	{
		// Geometry -------------------------------------------------
		var jsonLoader = new THREE.JSONLoader();
		
		
		jsonLoader.load("resources/lizard/objects/rock_obj.js", function(geometry){
			Resources.addGeometry(geometry, "rock");
		});
		
		jsonLoader.load("resources/lizard/objects/lizardeye_obj.js", function(geometry){
			Resources.addGeometry(geometry, "lizardeye");
		});
		
		jsonLoader.load("resources/lizard/objects/ground_obj.js", function(geometry){
			Resources.addGeometry(geometry, "ground");
		});	
	
		// Textures ------------------------------------------------
		var lizard_diffuse		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizard_diffuse.png");
		var lizard_normal		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizard_normal.png");
		var lizard_specular		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizard_specular.png");
		var lizard_emissive		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizard_emissive.png");
		var lizardeye_diffuse	= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizardeye_diffuse.png");
		var lizardeye_emissive	= new THREE.ImageUtils.loadTexture("resources/lizard/textures/lizardeye_emissive.png");
		var rock_diffuse		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/rock_diffuse.png");
		var rock_normal			= new THREE.ImageUtils.loadTexture("resources/lizard/textures/rock_normal.png");
		var rock_specular		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/rock_specular.png");
		var ground_diffuse		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/ground_diffuse.png");
		var ground_normal		= new THREE.ImageUtils.loadTexture("resources/lizard/textures/ground_normal.png");
		
		Resources.addTexture(lizard_diffuse, "lizard_diffuse");
		Resources.addTexture(lizard_normal, "lizard_normal");
		Resources.addTexture(lizard_specular, "lizard_specular");
		Resources.addTexture(lizard_emissive, "lizard_emissive");
		Resources.addTexture(lizardeye_diffuse, "lizardeye_diffuse");
		Resources.addTexture(lizardeye_emissive, "lizardeye_emissive");
		Resources.addTexture(rock_diffuse, "rock_diffuse");
		Resources.addTexture(rock_normal, "rock_normal");
		Resources.addTexture(rock_specular, "rock_specular");
		Resources.addTexture(ground_diffuse, "ground_diffuse");
		Resources.addTexture(ground_normal, "ground_normal");
		
		// Materials -----------------------------------------------
		var darkMat		= new THREE.MeshBasicMaterial({color: 0xFFFFFF});
		var wireMat		= new THREE.MeshBasicMaterial({wireframe: true, transparent: true});
		
		var lizardMat			= new THREE.MeshPhongMaterial({map: Resources.getTexture("lizard_specular")});
		lizardMat.normalMap		= Resources.getTexture("lizard_normal");
		lizardMat.specularMap	= Resources.getTexture("lizard_specular");
		lizardMat.specular		= new THREE.Color(0xFFFFFF);
		
		var lizardEyeMat 			= new THREE.MeshPhongMaterial({map: Resources.getTexture("lizardeye_diffuse")});
		lizardEyeMat.specularMap	= Resources.getTexture("lizardeye_emissive");
		lizardEyeMat.specular		= new THREE.Color(0xFFFFFF);
		
		var rockMat			= new THREE.MeshPhongMaterial({map: Resources.getTexture("rock_diffuse")});
		rockMat.normalMap	= Resources.getTexture("rock_normal");
		rockMat.specularMap	= Resources.getTexture("rock_specular");
		
		var groundMat		= new THREE.MeshPhongMaterial({map: Resources.getTexture("ground_diffuse")});
		groundMat.normalMap	= Resources.getTexture("ground_normal");
		
		Resources.addMaterial(darkMat, "dark");
		Resources.addMaterial(wireMat, "wireframe");
		Resources.addMaterial(lizardMat, "lizard");
		Resources.addMaterial(lizardEyeMat, "lizardeye");
		Resources.addMaterial(rockMat, "rock");
		Resources.addMaterial(groundMat, "ground");
		
		jsonLoader.load("resources/lizard/objects/lizard_obj.js", function(geometry){
			Resources.addGeometry(geometry, "lizard");
			
			lizard.main.createWorld();
		});
		
	},
	
	createWorld : function()
	{
		// Test Light
		this.light = new THREE.SpotLight(0xFFFFFF);
		
		this.light.position.set(0, 40, 0);
		this.light.castShadow			= true;
		this.light.shadowMapWidth		= 1024;
		this.light.shadowMapHeight		= 1024;
		this.light.shadowCameraNear		= 10;
		this.light.shadowCameraFar		= 200;
		this.light.shadowCameraFov		= 80;
		//this.light.shadowBias			= -0.0002;
		this.light.shadowDarkness		= 0.5;
		this.light.shadowCameraVisible	= true;
		
		// Lizard Sector ------------------------------------------------------------
		
		var lizardOBJ;
		var lizardEyeOBJ;
		var rockOBJ;
		var groundOBJ;
		
		// main body
		lizardOBJ = new THREE.Mesh(Resources.getGeometry("lizard"), Resources.getMaterial("lizard"));
		lizardOBJ.scale.set(10, 10, 10);
		lizardOBJ.castShadow		= true;
		lizardOBJ.receiveShadow		= true;
		//lizardOBJ.matrixAutoUpdate	= false;
		
		// eyes
		lizardEyeOBJ = new THREE.Mesh(Resources.getGeometry("lizardeye"), Resources.getMaterial("lizardeye"));
		lizardEyeOBJ.scale.set(10, 10, 10);
		lizardEyeOBJ.castShadow 		= true;
		lizardEyeOBJ.receiveShadow		= true;
		//lizardEyeOBJ.matrixAutoUpdate	= false;
		
		// rock
		rockOBJ = new THREE.Mesh(Resources.getGeometry("rock"), Resources.getMaterial("rock"));
		rockOBJ.scale.set(10, 10, 10);
		rockOBJ.castShadow		= true;
		rockOBJ.receiveShadow	= true;
		//rockOBJ.matrixAutoUpdate= false;
		
		// ground
		var geo_ground = new THREE.PlaneGeometry(200, 200, 0, 0);
		
		groundOBJ = new THREE.Mesh(geo_ground, Resources.getMaterial("ground"));
		//groundOBJ = new THREE.Mesh(Resources.getGeometry("ground"), Resources.getMaterial("ground"));
		//groundOBJ.scale.set(10, 10, 10);
		groundOBJ.rotation.x		= -0.5 * Math.PI;
		groundOBJ.position.y		= -10;
		groundOBJ.receiveShadow		= true;
		//groundOBJ.matrixAutoUpdate	= false;
		
		// TEST
		var test_geo = new THREE.SphereGeometry(5, 10, 10);
		var test_mat = new THREE.MeshPhongMaterial({color: 0x00FFF0});
		
		var test_mesh = new THREE.Mesh(test_geo, test_mat);
		test_mesh.position.set(20, 5, 10);
		test_mesh.castShadow = true;
		
		// Scene additions ---------------------------------------------------------
		SceneManager.activateScene("perspective");
		SceneManager.addToScene(this.light);
		SceneManager.addToScene(lizardOBJ);
		SceneManager.addToScene(lizardEyeOBJ);
		SceneManager.addToScene(rockOBJ);
		SceneManager.addToScene(groundOBJ);
		SceneManager.addToScene(test_mesh);
		
		// ready to render
		this.ready = true;
		
		//this.loop();
	},
	
	/*
	 * Updates all of the objects in the scene
	 *
	 * @return	none
	 */
	update : function()
	{
		// keyboard movement
		/*if(lizard.keyboard.pressed("D"))
			this.light.position.x -= 1;
		
		if(lizard.keyboard.pressed("S"))
			this.light.position.z -= 1;
			
		if(lizard.keyboard.pressed("A"))
			this.light.position.x += 1;
			
		if(lizard.keyboard.pressed("W"))
			this.light.position.z += 1;*/
		
		this.testStep += 0.1;

		// update light position
		var posX = 15 * (Math.sin(this.testStep));
		var posZ = 15 * (Math.cos(this.testStep));
		
		//var target = new THREE.Vector3(posX, 0, posZ);
		this.light.position.set(posX, this.light.position.y, posZ);
		
		var target = new THREE.Vector3(this.light.position.x, 0, this.light.position.z);
			
		this.light.target.position = target;
	},
	
	/*
	 * Renders all of the objects in the scene
	 *
	 * @return	none
	 */
	render : function()
	{
		CameraManager.activateCamera("perspective");
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	},
	
	/*
	 * Main loop for lizard.
	 *
	 * @return	none
	 */
	loop : function()
	{
		lizard.animationID = requestAnimationFrame(this.loop.bind(this));
		
		this.update();
		this.render();
	}
};