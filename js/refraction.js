/*
 * refraction.js
 *
 * @author Alex Mancillas
 * @edit   Freddy Garcia
 *
 * Refraction experience
 */

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.refraction = {
	dt      : 1/60,  // handles FPS
	ready   : false, // if the experiment is ready to play
	
	/*
	 * Calls functions necessary to load and initialize necessary components
	 * in order for the scene to show up
	 *
	 * @return  none
	 */
	init : function() 
	{
		console.log("refraction entry!");
		
		this.initThree();
		this.loadAndCreateAssets();
		this.createWorld();
	},
	
	/*
	 * Initializes the threejs components that will be needed for this
	 * experiment
	 *
	 * @return  none
	 */
	initThree : function()
	{
		// Scene -----------------------------------------------------
		SceneManager.activateScene("perspective");
		
		// Camera -----------------------------------------------------
		var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
		
		var properties = {
			lookAt : new THREE.Vector3(100, 100, 100),
			position: {x: -800, y: 0, z: 0}
		};
		
		var refractionCamera = new THREE.CubeCamera(0.1, 5000, 512);
		refractionCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
		
		CameraManager.addCamera(camera, "perspective_FPC");
		CameraManager.addCamera(refractionCamera, "cube_refraction");
		CameraManager.modifyCamera(properties, "perspective_FPC");
		
		// Renderer ----------------------------------------------------
		app.main.renderer.setClearColor(0xADBEED);
		
		// Controls ----------------------------------------------------
		app.main.controls = new THREE.FirstPersonControls(CameraManager.getCamera("perspective_FPC"));
		app.main.controls.movementSpeed = 300;
		app.main.controls.lookSpeed     = .2;
		app.main.controls.autoForward   = false;
	},
	
	/*
	 * Loads and creates assets for the experience
	 *
	 * @return  none
	 */
	loadAndCreateAssets : function()
	{
		// Geometries ------------------------------------------------------
		var geometry = new THREE.BoxGeometry(1, 1, 1, 1);
		var floorgeo = new THREE.Geometry();
		
		// Population of cubes
		for(var ix = 0; ix < 225; ix++)
		{
			var cube = new THREE.Mesh(geometry.clone());
			cube.scale.x = 50;
			cube.position.x = -(Math.random()*1000 - 1200);
			cube.scale.y = 50;
			cube.position.y = (Math.random()*2000 - 1000);
			cube.scale.z = 50;
			cube.position.z = (Math.random()*2000 - 1000);
			
			THREE.GeometryUtils.merge(floorgeo, cube);
		}
		
		Resources.addGeometry(floorgeo, "refraction_floor");
		
		// Textures --------------------------------------------------------
		var skybox_diffuse = THREE.ImageUtils.loadTexture("resources/refraction/textures/defaultTexture.png");
		
		Resources.addTexture(skybox_diffuse, "refraction_skybox");
		
		// Materials -------------------------------------------------------
		
		// skybox
		var materialArray = [];
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("refraction_skybox") }));
		
		for (var i = 0; i < 6; i++)
		   materialArray[i].side = THREE.BackSide;
		   
		var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
		
		// refraction
		var refractionMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0xffffff, // do not alter the refraction color
			envMap: CameraManager.getCamera("cube_refraction").renderTarget, //mapping will be rendered by the camera's render target
			refractionRatio: 0.97, //a happy medium, will have the cool effect without over doing it or making it bland
			reflectivity: 0.9
		});
		
		Resources.addMaterial(skyboxMaterial, "refraction_skybox");
		Resources.addMaterial(refractionMaterial, "cube_refraction");
	},
	
	/*
	 * Handles additional asset creation and adds all objects to
	 * the experience
	 *
	 * @return  none
	 */
	createWorld : function()
	{
		// Objects --------------------------------------------------------
		var material   = new THREE.MeshPhongMaterial({color: 0x444444});
		var skyboxGeom = new THREE.BoxGeometry(5000, 5000, 5000, 1, 1, 1);
		var refracGeom = new THREE.SphereGeometry(100, 32, 16);
		
		var floor = new THREE.Mesh(Resources.getGeometry("refraction_floor"), material);
		floor.castShadow = true;
		floor.receiveShadow = true;
		
		var skybox = new THREE.Mesh(skyboxGeom, Resources.getMaterial("refraction_skybox"));
		
		var refractionSphere = new THREE.Mesh(refracGeom, Resources.getMaterial("cube_refraction"));
		refractionSphere.position.set(-100, 0, 0);
		
		Resources.addObject(floor, "refraction_floor");
		Resources.addObject(skybox, "refraction_skybox");
		Resources.addObject(refractionSphere, "refraction_sphere");
		
		// Lights ---------------------------------------------------------
		var light = new THREE.DirectionalLight(0xffffff,4);
		light.position.set(500,500,500);
		light.castShadow = true;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;
		light.shadowCameraVisible	= true;
		
		var d = 1000;
		light.shadowCameraLeft = d;
		light.shadowCameraTop = d;
		
		light.shadowCameraRight = -d;
		light.shadowCameraBottom = -d;
		
		light.shadowCameraFar = 2500;
		
		var spotlight = new THREE.SpotLight(0xffff00);
		spotlight.position.set(-200,200,-200);
		spotlight.shadowCameraVisible = true;
		spotlight.shadowDarkness = 0.95;
		spotlight.intensity = 2;
		
		var spotlight2 = new THREE.SpotLight(0xff00ff);
		spotlight2.position.set(-200,-200,-200);
		spotlight2.shadowCameraVisible = true;
		spotlight2.shadowDarkness = 0.95;
		spotlight2.intensity = 2;
		
		var spotlight3 = new THREE.SpotLight(0x00ffff);
		spotlight3.position.set(-200,200,200);
		spotlight3.shadowCameraVisible = true;
		spotlight3.shadowDarkness = 0.95;
		spotlight3.intensity = 2;
		
		var spotlight4 = new THREE.SpotLight(0xffffff);
		spotlight4.position.set(-200,-200,200);
		spotlight4.shadowCameraVisible = true;
		spotlight4.shadowDarkness = 0.95;
		spotlight4.intensity = 2;
		
		var lightTarget = new THREE.Object3D();
		lightTarget.position.set(0,0,0);
		
		spotlight.target = lightTarget;
		spotlight2.target = lightTarget;
		spotlight3.target = lightTarget;
		spotlight4.target = lightTarget;
		
		// must enable shadow casting ability for the light
		spotlight.castShadow = true;
		spotlight2.castShadow = true;
		spotlight3.castShadow = true;
		spotlight4.castShadow = true;
	
		// Scene Additions ------------------------------------------------
		SceneManager.addToScene(CameraManager.getCamera("cube_refraction"), "perspective");
		SceneManager.addToScene(Resources.getObject("refraction_floor"), "perspective");
		SceneManager.addToScene(Resources.getObject("refraction_skybox"), "perspective");
		SceneManager.addToScene(Resources.getObject("refraction_sphere"), "perspective");
		SceneManager.addToScene(light, "perspective");
		SceneManager.addToScene(lightTarget, "perspective");
		SceneManager.addToScene(spotlight, "perspective");
		SceneManager.addToScene(spotlight2, "perspective");
		SceneManager.addToScene(spotlight3, "perspective");
		SceneManager.addToScene(spotlight4, "perspective");
		
		// Post-add modifications -----------------------------------------
		var properties = {
			position : {x: -100, y: 0, z: 0}
		};
		
		CameraManager.modifyCamera(properties, "cube_refraction");
		
		this.ready = true;
	},
		
	/*
	 * Updates all of the objects in the experience
	 *
	 * @return  none
	 */
    update: function()
	{
		// UPDATE
		app.main.controls.update(this.dt);
	},
	
	/* 
	 * Renders all of the objects in the experience
	 *
	 * @return  none
	 */
	render : function()
	{
		SceneManager.activateScene("perspective");
		CameraManager.activateCamera("perspective_FPC");
	
		Resources.getObject("refraction_sphere").visible = false;
		CameraManager.getCamera("cube_refraction").updateCubeMap(app.main.renderer, SceneManager.getScene());
		Resources.getObject("refraction_sphere").visible = true;
		
		// DRAW	
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	}
};