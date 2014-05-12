"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.test = {

		renderer: undefined,
		scene: undefined,
		camera: undefined,
		paused: false,
		dt: 1/60,
		controls: undefined,
		plane: undefined,
		
		refractionSphere: undefined, 
		refractionCamera: undefined,
		
    	init : function() {
			console.log('init called');
			this.setupThreeJS();
			this.setupWorld();
			this.update();
    	},
		
    update: function(){
    	// schedule next animation frame
    	app.animationID = requestAnimationFrame(this.update.bind(this));
    	
		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }
	
		// UPDATE
		this.controls.update(this.dt);
		
		this.refractionSphere.visible = false;
		this.refractionCamera.updateCubeMap( this.renderer, this.scene );
		this.refractionSphere.visible = true;
		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();

				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.y = 0;
				this.camera.position.z = 0;
				this.camera.position.x = -800;

				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.shadowMapEnabled = true;
				this.renderer.setClearColor( 0xADBEED, 1);
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 300;
				this.controls.lookSpeed = .2;
				this.controls.autoForward = false;
				this.camera.lookAt(100,-100,100);
			},
			
	setupWorld: function() {
				////////////////////////////////////////////////////////
				//
				//	refraction demo
				//
				//	first let's give it something to refract, I'm feeling like
				//	randomly generated cubes can work here
				//
				////////////////////////////////////////////////////////
				var geometry = new THREE.CubeGeometry(1, 1, 1, 1);
				var floorgeo = new THREE.Geometry();
				
				for(var ix = 0; ix < 25; ix++)
				{
					for(var iy = 0; iy < 25; iy++)
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
				}
				
				var material = new THREE.MeshPhongMaterial({color: 0x444444});
				// ignore the fact that the floating cube mesh is called "floor"
				// its just a consistency habit for these experiments
				var floor = new THREE.Mesh(floorgeo, material);
				floor.castShadow = true;
				floor.receiveShadow = true;
				this.scene.add(floor);
				////////////////////////////////////////////////////////
				//
				//	skybox
				//
				////////////////////////////////////////////////////////
				// make those materials
				var materialArray = [];
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				for (var i = 0; i < 6; i++)
				   materialArray[i].side = THREE.BackSide;
				//completely make the skyox material using the array above
				var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
				var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
				var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
				this.scene.add( skybox );
				////////////////////////////////////////////////////////
				//
				//	refraction
				//
				////////////////////////////////////////////////////////
				//geometry for the sphere
				var sphereGeometry =  new THREE.SphereGeometry( 100, 32, 16 ); 
				// its going to use a camera for its shenanigans
				this.refractionCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
				//get it inside the scene
				this.scene.add( this.refractionCamera );
				//what the camera gets will be mapped to its render target
				this.refractionCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
				//make a material
				var refractionMaterial = new THREE.MeshBasicMaterial( 
				{
					color: 0xffffff,		// do not alter the refraction color
					envMap: this.refractionCamera.renderTarget, //mapping will be rendered by the camera's render target
					refractionRatio: 0.97, 	//a happy medium, will have the cool effect without over doing it or making it bland
					reflectivity: 0.9 
				} );
				// make the sphere
				this.refractionSphere = new THREE.Mesh( sphereGeometry, refractionMaterial );
				//set its position away from the cubes
				this.refractionSphere.position.set(-100,0,0);
				this.refractionCamera.position = this.refractionSphere.position;
				this.scene.add(this.refractionSphere);
				
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
				
				this.scene.add(light);
				
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
				this.scene.add(lightTarget);
				spotlight.target = lightTarget;
				spotlight2.target = lightTarget;
				spotlight3.target = lightTarget;
				spotlight4.target = lightTarget;
				// must enable shadow casting ability for the light
				spotlight.castShadow = true;
				this.scene.add(spotlight);
				spotlight2.castShadow = true;
				this.scene.add(spotlight2);
				spotlight3.castShadow = true;
				this.scene.add(spotlight3);
				spotlight4.castShadow = true;
				this.scene.add(spotlight4);
			},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}
	
};