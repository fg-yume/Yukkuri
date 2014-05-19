/*
 * reflection.js
 *
 * @author  Alex Mancillas
 * @edit    Freddy Garcia
 *
 * Reflection experience
 */

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.reflection = {
	dt: 1/60,
	//controls: undefined,
	plane: undefined,
	
	mirrorEffectSphere1: undefined,
	mirrorEffectSphereCamera1: undefined,

	/*
	 * Calls functions necessary to load and initialize necessary components
	 * in order for the scene to show up
	 *
	 * @return  none
	 */
	init : function() 
	{
		console.log('init called');
		
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
		// Scene -------------------------------------------------------
		SceneManager.activateScene("perspective");
		
		// Camera ------------------------------------------------------
		var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
		
		var reflectionCamera = new THREE.CubeCamera(0.1, 5000, 512);
		
		var properties = {
			position: {x: -800, y: 300, z: 0},
			lookAt  : new THREE.Vector3(100, -100, 100)
		};
		
		CameraManager.addCamera(camera, "perspective_FPC");
		CameraManager.addCamera(reflectionCamera, "cube_reflection");
		CameraManager.modifyCamera(properties, "perspective_FPC");
		
		// Renderer ----------------------------------------------------
		app.main.renderer.setClearColor(0xADBEED);
		
		// Controls ----------------------------------------------------
		app.main.controls = new THREE.FirstPersonControls(CameraManager.getCamera("perspective_FPC"));
		app.main.controls.movementSpeed = 600;
		app.main.controls.lookSpeed     = .4;
		app.main.controls.autoForward   = false;
	},
	
	loadAndCreateAssets : function()
	{
		// Geometry --------------------------------------------------------
		var floorgeo = new THREE.Geometry();
		
		// Generate floor
		for(var ix = 0; ix < 10; ix++)
		{
			for(var iy = 0; iy < 10; iy++)
			{
				var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({color: 0x000000, overdraw: true}))
				plane.position.x = ix * 100 - 500;
				plane.position.z = iy * 100 - 500;
				
				plane.rotation.x = (-((Math.random()*(0.08)) + 0.46)) * Math.PI;
				plane.rotation.y = (0.04-(Math.random()*0.08)) * Math.PI;
				plane.rotation.z = (0.04-(Math.random()*0.08)) * Math.PI;
				
				plane.position.y = (Math.random() * (ix + iy));
				
				THREE.GeometryUtils.merge(floorgeo, plane);
			}
		}
		
		Resources.addGeometry(floorgeo, "reflection_ground");
		
		// Textures ---------------------------------------------------------
		var skybox_diffuse = THREE.ImageUtils.loadTexture("resources/reflection/textures/defaultTexture.png");
		
		Resources.addTexture(skybox_diffuse, "reflection_skybox");
		
		// Materials --------------------------------------------------------
		
		// skybox
		var materialArray = [];
		
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("reflection_skybox") }));
		
		for (var i = 0; i < 6; i++)
		   materialArray[i].side = THREE.BackSide;
		   
		var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
		
		// mirror
		var mirrorSphereMaterial = new THREE.MeshBasicMaterial(
		{
			envMap: CameraManager.getCamera("cube_reflection").renderTarget
		});
		
		Resources.addMaterial(skyboxMaterial, "reflection_skybox");
		Resources.addMaterial(mirrorSphereMaterial, "cube_reflection");
	},
	
	/*
	 * Handles additional asset creation and adds all objects to
	 * the experience
	 *
	 * @return  none
	 */
	createWorld : function()
	{
		// Objects ---------------------------------------------------------
		var material   = new THREE.MeshPhongMaterial({color: 0x444444});
		var skyboxGeom = new THREE.BoxGeometry(5000, 5000, 5000, 1, 1, 1);
		var sphereGeom = new THREE.SphereGeometry(100, 32, 16);
		var boxGeom    = new THREE.BoxGeometry(50, 50, 50);
		
		var floor = new THREE.Mesh(Resources.getGeometry("reflection_ground"), material);
		floor.castShadow    = true;
		floor.receiveShadow = true;
		
		var skybox = new THREE.Mesh(skyboxGeom, Resources.getMaterial("reflection_skybox"));
		
		var mirrorSphere = new THREE.Mesh(sphereGeom, Resources.getMaterial("cube_reflection"));
		mirrorSphere.position.set(0, 150, 0);
		
		Resources.addObject(floor, "reflection_floor");
		Resources.addObject(skybox, "reflection_skybox");
		Resources.addObject(mirrorSphere, "reflection_sphere");
		
		// Lights ----------------------------------------------------------
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
		spotlight.position.set(-500,500,-500);
		spotlight.shadowCameraVisible = true;
		spotlight.shadowDarkness = 0.95;
		spotlight.intensity = 1;
		
		var spotlight2 = new THREE.SpotLight(0xff00ff);
		spotlight2.position.set(500,500,-500);
		spotlight2.shadowCameraVisible = true;
		spotlight2.shadowDarkness = 0.95;
		spotlight2.intensity = 1;
		
		var spotlight3 = new THREE.SpotLight(0x00ffff);
		spotlight3.position.set(-500,500,500);
		spotlight3.shadowCameraVisible = true;
		spotlight3.shadowDarkness = 0.95;
		spotlight3.intensity = 1;
		
		var lightTarget = new THREE.Object3D();
		lightTarget.position.set(0,0,0);
		
		spotlight.target = lightTarget;
		spotlight2.target = lightTarget;
		spotlight3.target = lightTarget;
		
		// must enable shadow casting ability for the light
		spotlight.castShadow = true;
		spotlight2.castShadow = true;
		spotlight3.castShadow = true;
		
		// Additions to Scene ----------------------------------------------
		SceneManager.addToScene(CameraManager.getCamera("cube_reflection"), "perspective");
		SceneManager.addToScene(floor, "perspective");
		SceneManager.addToScene(skybox, "perspective");
		SceneManager.addToScene(mirrorSphere, "perspective");
		SceneManager.addToScene(light, "perspective");
		SceneManager.addToScene(lightTarget, "perspective");
		SceneManager.addToScene(spotlight, "perspective");
		SceneManager.addToScene(spotlight2, "perspective");
		SceneManager.addToScene(spotlight3, "perspective");
		
		// Post-addition modifications
		var properties = {
			position: {x: 0, y: 150, z: 0}
		};
		
		CameraManager.modifyCamera(properties, "cube_reflection");
		
		this.ready = true;
	},
	
	update: function()
	{
		app.main.controls.update(this.dt);	
	},
	
	render: function()
	{	
		SceneManager.activateScene("perspective");
		CameraManager.activateCamera("perspective_FPC");
	
		Resources.getObject("reflection_sphere").visible = false;
		CameraManager.getCamera("cube_reflection").updateCubeMap( app.main.renderer, SceneManager.getScene() );
		Resources.getObject("reflection_sphere").visible = true;
	
		// DRAW	
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	}
};