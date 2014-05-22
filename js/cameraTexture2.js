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
	
	backplane: undefined,
	textureCameraPlane: undefined,
	textureCamera: undefined,
	renderTarget: undefined,
	textureCameraPlane2: undefined,
	renderTarget2: undefined,
		
	cameraCube: undefined,
		
	ccx: 0,
	ccy: -450,
	ccz: -1000,
	counter: 0,
	guiControls: undefined,
	gui: undefined,
	
	/*
	 * Calls functions necessary to load and initialize necessary components
	 * in order for the scene to show up
	 *
	 * @return  none
	 */
	init : function() 
	{
		console.log('reflection entry!');
		
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
		
		this.textureCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
		this.textureCamera.position.y = this.ccy;
		this.textureCamera.position.z =  this.ccz;
		this.textureCamera.position.x =  this.ccx;
		this.textureCamera.lookAt(new THREE.Vector3(0,0,0));
		
		var properties = {
			position: {x: -800, y: 300, z: 0},
			lookAt  : new THREE.Vector3(100, -100, 100)
		};
		
		CameraManager.addCamera(camera, "perspective_FPC");
		CameraManager.addCamera(textureCamera, "texture_camera");
		CameraManager.modifyCamera(properties, "perspective_FPC");
		
		// Renderer ----------------------------------------------------
		app.main.renderer.setClearColor(0xADBEED);
		
		// Controls ----------------------------------------------------
		app.main.controls = new THREE.FirstPersonControls(CameraManager.getCamera("perspective_FPC"));
		app.main.controls.movementSpeed = 600;
		app.main.controls.lookSpeed     = .4;
		app.main.controls.autoForward   = false;
	},
	
	/*
	 * Loads and creates assets for the experience
	 *
	 * @return  none
	 */
	loadAndCreateAssets : function()
	{
		// Geometry --------------------------------------------------------
		var floorgeo = new THREE.Geometry();
		
		// Generate floor
		for(var ix = 0; ix < 5; ix++)
		{
			for(var iy = 0; iy < 5; iy++)
			{
				var plane = new THREE.Mesh(new THREE.SphereGeometry(50,12,12), new THREE.MeshPhongMaterial({color: 0x000000, overdraw: true}))
				plane.position.x = (Math.random() * 1000 - 500);
				plane.position.y = (Math.random() * 1000 - 700);
				plane.position.z = (Math.random() * 1000 - 500);
						
				THREE.GeometryUtils.merge(floorgeo, plane);
			}
		}
		
		Resources.addGeometry(floorgeo, "cameraTexture_ground");
		
		// Textures ---------------------------------------------------------
		var skybox_diffuse = THREE.ImageUtils.loadTexture("resources/cameraTexture/textures/defaultTexture.png");
		
		Resources.addTexture(skybox_diffuse, "cameraTexture_skybox");
		
		// Materials --------------------------------------------------------
		
		// skybox
		var materialArray = [];
		
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("cameraTexture_skybox") }));
		
		for (var i = 0; i < 6; i++)
		   materialArray[i].side = THREE.BackSide;
		   
		var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
		
		var cubeGeometry = new THREE.CubeGeometry(40,40,40);
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
		this.cameraCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		this.cameraCube.position.x=this.ccx;
		this.cameraCube.position.y=this.ccy;
		this.cameraCube.position.z=this.ccz;
		
		this.renderTarget = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBFormat } );
		var screenMaterial = new THREE.MeshBasicMaterial( { map: this.renderTarget } );
		var planeGeometry = new THREE.PlaneGeometry(500,500,1,1);
		this.textureCameraPlane = new THREE.Mesh(planeGeometry,screenMaterial);
		this.textureCameraPlane.position.x = 500;
		this.textureCameraPlane.position.z = -260;
		this.textureCameraPlane.position.y = 500;
		this.textureCameraPlane.rotation.y = -Math.PI/2;
		
		this.renderTarget2 = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBFormat } );
		var screenMaterial2 = new THREE.MeshBasicMaterial( { map: this.renderTarget2 } );
		var planeGeometry2 = new THREE.PlaneGeometry(500,500,1,1);
		this.textureCameraPlane2 = new THREE.Mesh(planeGeometry2,screenMaterial2);
		this.textureCameraPlane2.position.x = 500;
		this.textureCameraPlane2.position.z = 260;
		this.textureCameraPlane2.position.y = 500;
		this.textureCameraPlane2.rotation.y = -Math.PI/2;
		
		var planeGeo = new THREE.PlaneGeometry(1070,550,1,1);
		var planeMat = new THREE.MeshLambertMaterial({color: 0x000000});
		this.backplane = new THREE.Mesh(planeGeo,planeMat);
		this.backplane.rotation.y = -Math.PI/2;
		this.backplane.position.x = 510;
		this.backplane.position.z = 0;
		this.backplane.position.y = 500;
		
		Resources.addMaterial(skyboxMaterial, "cameraTexture_skybox");
		
		this.guiControls = new function()
		{
			this.speed = 1;
			this.distance = 1000;
			this.height = -450;
		}
		
		this.gui = new dat.GUI();
		this.gui.add(this.guiControls, 'speed', 0, 10);
		this.gui.add(this.guiControls, 'distance', 500, 2000);
		this.gui.add(this.guiControls, 'height', -900, 0);
		this.gui.open();
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
		
		var floor = new THREE.Mesh(Resources.getGeometry("cameraTexture_ground"), material);
		floor.castShadow    = true;
		floor.receiveShadow = true;
		
		var skybox = new THREE.Mesh(skyboxGeom, Resources.getMaterial("cameraTexture_skybox"));
		
		Resources.addObject(this.textureCameraPlane, "cameraTexture_textureCameraPlane");
		Resources.addObject(this.textureCameraPlane2, "cameraTexture_textureCameraPlane2");
		Resources.addObject(this.backplane, "cameraTexture_backplane");
		Resources.addObject(this.cameraCube, "cameraTexture_cameraCube");
		Resources.addObject(floor, "cameraTexture_floor");
		Resources.addObject(skybox, "cameraTexture_skybox");
		
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
		SceneManager.addToScene(CameraManager.getCamera("texture_camera"), "perspective");
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
			position: {x: this.ccx, y: this.ccx, z: this.ccx}
		};
		
		CameraManager.modifyCamera(properties, "texture_camera");
		
		this.ready = true;
	},
	
	/*
	 * Updates all of the objects in the experience
	 *
	 * @return  none
	 */
	update: function()
	{
		//app.main.controls.update(this.dt);	
		this.counter+= this.guiControls.speed;
		this.ccx = Math.cos((this.counter*(Math.PI))/1000) * this.guiControls.distance;
		this.ccz = Math.sin((this.counter*(Math.PI))/1000) * this.guiControls.distance;
		
		this.ccy = this.guiControls.height;
		
		this.textureCamera.position.z = this.ccz;
		this.textureCamera.position.x = this.ccx;
		this.textureCamera.position.y = this.ccy;
		
		this.cameraCube.position.x=this.ccx;
		this.cameraCube.position.z=this.ccz;
		this.cameraCube.position.y = this.ccy;
		
		this.textureCamera.lookAt(new THREE.Vector3(0,0,0));
	},
	
	/* 
	 * Renders all of the objects in the experience
	 *
	 * @return  none
	 */
	render: function()
	{	
		SceneManager.activateScene("perspective");
		CameraManager.activateCamera("perspective_FPC");
	
		Resources.getObject("reflection_sphere").visible = false;
		CameraManager.getCamera("texture_camera").updateCubeMap( app.main.renderer, SceneManager.getScene() );
		Resources.getObject("reflection_sphere").visible = true;
	
		// DRAW	
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	}
};