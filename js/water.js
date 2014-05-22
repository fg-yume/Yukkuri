/*
 * water.js
 *
 * @author  Alex Mancillas
 * @edit    Freddy Garcia
 *
 * Water experience
 */

"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.water = {
	// variable properties
	dt: 1/60,
	ox: [],
	oy: [],
	or: [],
	oz: [],
	customUniforms: undefined,
	ready : false,
	
	showGrid: true,
	count: 0.0,
	
	guiControls: undefined,
	gui: undefined,
	sound1			: undefined,
	
	/*
	 * Calls functions necessary to load and initialize necessary components
	 * in order for the scene to show up
	 *
	 * @return  none
	 */
	init : function() 
	{
		console.log('water entry!');
		
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
		// Scene ----------------------------------------------------------
		SceneManager.activateScene("perspective");
		
		// Camera ---------------------------------------------------------
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		
		var properties = {
			position : {x: -800, y: 300, z: 0},
			lookAt   : new THREE.Vector3(100, -100, 100)
		};
		
		CameraManager.addCamera(camera, "perspective_FPC");
		CameraManager.modifyCamera(properties, "perspective_FPC");
		
		// Renderer -------------------------------------------------------
		app.main.renderer.setClearColor(0x000000);
		
		// Controls -------------------------------------------------------
		/*app.main.controls = new THREE.FirstPersonControls(CameraManager.getCamera("perspective_FPC"));
		
		app.main.controls.movementSpeed = 300;
		app.main.controls.lookSpeed     = .2;
		app.main.controls.autoForward   = false;*/
	},
	
	/*
	 * Loads and creates assets for the experience
	 *
	 * @return  none
	 */
	loadAndCreateAssets : function()
	{
		// Geometry ------------------------------------------------------
		var geo = new THREE.PlaneGeometry(1000, 1000, 49, 49);
		
		for(var i = 0; i < geo.vertices.length;i++)
		{
			this.ox[i] = geo.vertices[i].x;
			this.oy[i] = geo.vertices[i].y;
			this.oz[i] = -Math.sin( (i%50) * Math.PI );
			this.or[i] = Math.random() * 1000;
		}
		
		console.log(geo.vertices.length);
		
		// debug grid
		if(this.showGrid)
		{
			var geo2 = new THREE.PlaneGeometry(1000, 1000, 49, 49);
			Resources.addGeometry(geo2, "water_debug");
		}
		
		Resources.addGeometry(geo, "water_plane");
		
		// Textures ------------------------------------------------------
		var baseTexture  = new THREE.ImageUtils.loadTexture( "resources/water/textures/water.jpg" );
		baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping; 
		
		var noiseTexture = new THREE.ImageUtils.loadTexture( "resources/water/textures/noise1.png" );
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
		
		var blendTexture = new THREE.ImageUtils.loadTexture( "resources/water/textures/waterblend.png" );
		blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
		
		var skyboxTexture = new THREE.ImageUtils.loadTexture("resources/water/textures/checker.png");
		
		Resources.addTexture(baseTexture, "water_base");
		Resources.addTexture(noiseTexture, "water_noise");
		Resources.addTexture(blendTexture, "water_blend");
		Resources.addTexture(skyboxTexture, "water_skybox");
		
		// Materials -----------------------------------------------------
		
		// shader material
		this.customUniforms = {
			baseTexture  : { type: "t", value: baseTexture },
			noiseTexture : { type: "t", value: noiseTexture },
			blendTexture : { type: "t", value: blendTexture },
			
			baseSpeed    : { type: "f", value: 0.001 },
			
			repeatCol    : { type: "f", value: 4 },
			repeatRow    : { type: "f", value: 4 },
			
			noiseScale   : { type: "f", value:  .8 },
			
			blendSpeed   : { type: "f", value: 0.01 },
			blendOffset  : { type: "f", value: 0.6 },
			
			alpha        : { type: "f", value: 1.0 },
			time         : { type: "f", value: 1.0 }
		};
		
		var customMaterial = new THREE.ShaderMaterial(
		{
			uniforms: this.customUniforms,
			vertexShader: document.querySelector( "#vertexShader" ).textContent,
			fragmentShader: document.querySelector( "#fragmentShader" ).textContent
		});
		
		// skybox material
		var materialArray = [];
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		materialArray.push(new THREE.MeshBasicMaterial( { map: Resources.getTexture("water_skybox") }));
		
		for (var i = 0; i < 6; i++)
		   materialArray[i].side = THREE.BackSide;
		   
		var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
		
		Resources.addMaterial(customMaterial, "water_shader");
		Resources.addMaterial(skyboxMaterial, "water_skybox");
		
		this.guiControls = new function()
		{
			this.speed = 3;
			this.waves = 4;
			this.height = 10;
		};
		
		this.gui = new dat.GUI();
		this.gui.add(this.guiControls, 'speed', 0, 10);
		this.gui.add(this.guiControls, 'waves', 1, 6);
		this.gui.add(this.guiControls, 'height', 0, 20);
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
		// Objects -------------------------------------------------------
		var skyboxGeom = new THREE.BoxGeometry(5000, 5000, 5000, 1, 1, 1);
		
		// water plane
		var plane = new THREE.Mesh(Resources.getGeometry("water_plane"), Resources.getMaterial("water_shader"));
		plane.rotation.x = -0.5 * Math.PI;
		
		// debug grid
		if(this.showGrid)
		{
			var mat = new THREE.MeshPhongMaterial({color: 0x66666, wireframe: true});
			
			var gridPlane = new THREE.Mesh(Resources.getGeometry("water_debug"), mat);
			gridPlane.rotation.x = -0.5 * Math.PI;
			
			Resources.addObject(gridPlane, "water_debug");
		}
		
		var skybox = new THREE.Mesh(skyboxGeom, Resources.getMaterial("water_skybox"));
		
		Resources.addObject(plane, "water_normal");
		Resources.addObject(skybox, "water_skybox");
		
		// Lights --------------------------------------------------------
		var light = new THREE.DirectionalLight(0xffffff,4);
		light.position.set(500,500,500);
		light.castShadow          = true;
		light.shadowMapWidth      = 2048;
		light.shadowMapHeight     = 2048;
		light.shadowCameraVisible = true;
		
		var d = 1000;
		light.shadowCameraLeft   = d;
		light.shadowCameraTop    = d;
		light.shadowCameraRight  = -d;
		light.shadowCameraBottom = -d;
		light.shadowCameraFar    = 2500;
		
		var pointlight = new THREE.PointLight(0xffffff, 1, 100 );
		pointlight.position.set(0,600,0);
		pointlight.shadowCameraVisible	= true;
		
		// Scene Additions -----------------------------------------------
		SceneManager.addToScene(plane, "perspective");
		SceneManager.addToScene(skybox, "perspective");
		SceneManager.addToScene(light, "perspective");
		SceneManager.addToScene(pointlight, "perspective");
		
		// debug grid
		if(this.showGrid)
			SceneManager.addToScene(gridPlane, "perspective");
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
		
		var div = document.getElementById("info");
		div.parentNode.removeChild(div);
		
		this.sound1 = new Sound( [ 'resources/sound/soundtrack.mp3', 'resources/sound/soundtrack.ogg' ], 1, 0.01 );
		this.sound1.play();
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
		
		var geo  = Resources.getGeometry("water_plane");
		var geo2 = Resources.getGeometry("water_debug");

		for(var i = 0; i < geo.vertices.length; i++)
		{
			geo.vertices[i].x = this.ox[i] +(Math.sin((this.count + this.or[i])/(Math.floor(this.guiControls.waves) * 25) * Math.PI)*3);
			geo.vertices[i].y = this.oy[i] +(Math.cos((this.count + this.or[i])/(Math.floor(this.guiControls.waves) * 25) * Math.PI)*3);
			//this.geo.vertices[i].z = (this.oz[i]*1000) -(Math.sin((this.count + this.or[i])/50 * Math.PI)*5);
			geo.vertices[i].z = -(Math.sin(((i+this.count)/400)*Math.PI) * this.guiControls.height);
			
			if(this.showGrid)
			{
				geo2.vertices[i].x = geo.vertices[i].x;
				geo2.vertices[i].y = geo.vertices[i].y;
				geo2.vertices[i].z = geo.vertices[i].z + 400;
			}
		}
		
		this.count += this.guiControls.speed;
		geo.verticesNeedUpdate = true;
		
		if(this.showGrid)
			geo2.verticesNeedUpdate = true;
		
		this.customUniforms.time.value += this.dt;
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
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	}
};