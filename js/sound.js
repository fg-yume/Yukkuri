/*
 * water.js
 *
 * @author  Alex Mancillas
 *
 * sound experience
 */
"use strict";
var app = app || {};

app.sound = {
	dt: 1/60,
	step: 0,
	sound1: undefined,
	ready : false,
	
	sound : function ( sources, radius, volume ) {
	
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
	},
	/*
	 * Calls functions necessary to load and initialize necessary components
	 * in order for the scene to show up
	 *
	 * @return  none
	 */
	init : function() 
	{
		console.log('sound entry!');
		
		this.initThree();
		this.loadAndCreateAssets();
		//this.createWorld();
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
			position : {x: -30, y: 40, z: 30},
			lookAt   : new THREE.Vector3(0, 0, 0)
		};
		
		CameraManager.addCamera(camera, "perspective_FPC");
		CameraManager.modifyCamera(properties, "perspective_FPC");
		
		// Renderer -------------------------------------------------------
		app.main.renderer.setClearColor(0x000000);
	},
	/*
	 * Loads and creates assets for the experience
	 *
	 * @return  none
	 */
	loadAndCreateAssets : function()
	{
		var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
        var planeMaterial =    new THREE.MeshLambertMaterial({color: 0xff00ff});
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);
        plane.receiveShadow  = true;
		plane.rotation.x=-0.5*Math.PI;
        plane.position.x=15
        plane.position.y=0
        plane.position.z=0
		
		plane.scale.x = plane.scale.x * 1.5;
		plane.scale.y = plane.scale.y * 1.5;
		
		Resources.addObject(plane,"sound_plane");
		
		var cubeGeometry = new THREE.CubeGeometry(4,4,4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x=-4;
        cube.position.y=3;
        cube.position.z=0;

        // add the cube to the scene
        Resources.addObject(cube,"sound_cube");
		
		var sphereGeometry = new THREE.SphereGeometry(4,20,20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

        // position the sphere
        sphere.position.x=20;
        sphere.position.y=0;
        sphere.position.z=2;
        sphere.castShadow=true;
		
        // add the sphere to the scene
        Resources.addObject(sphere,"sound_sphere");
		
		var sphereGeometry2 = new THREE.SphereGeometry(4,10,10);
        var sphereMaterial2 = new THREE.MeshLambertMaterial({color: 0x00ff00});
        var sphere2 = new THREE.Mesh(sphereGeometry2,sphereMaterial2);
		
        // position and point the camera to the center of the scene
		
		this.sound1 = new Sound( [ 'soundtrack.mp3', 'soundtrack.ogg' ], 275, 1 );
		this.sound1.position.copy( sphere.position );
		this.sound1.play();

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        Resources.addObject(ambientLight,"sound_ambientLight");
		
		this.ready = true;
	},
	update : function()
	{
		var cube = Resources.getObject( "sound_cube" );

		// bounce the sphere up and down
		step+=dt;
		
		var sphere = Resources.getObject( "sound_sphere" );
		
		sphere.position.x = 20 +( 10*(Math.cos(step)));
		sphere.position.z = 0 +( 10*Math.abs(Math.sin(step)));
		
		cube.position.x = 20 +( 10*(Math.cos(step)));
		cube.position.z = 0 -( 10*Math.abs(Math.sin(step)));
	},
	render : function()
	{
		SceneManager.activateScene("perspective");
		CameraManager.activateCamera("perspective_FPC");
		app.main.renderer.render(SceneManager.getScene(), CameraManager.getCamera());
	}
};