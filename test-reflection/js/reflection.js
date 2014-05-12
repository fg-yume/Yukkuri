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
		
		mirrorEffectSphere1: undefined,
		mirrorEffectSphereCamera1: undefined,

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
		
		this.mirrorEffectSphere1.visible = false;
		this.mirrorEffectSphereCamera1.updateCubeMap( this.renderer, this.scene );
		this.mirrorEffectSphere1.visible = true;

		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0xADBEED, 0.002);

				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.y = 300;
				this.camera.position.z = 0;
				this.camera.position.x = -800;

				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.shadowMapEnabled = true;
				this.renderer.setClearColor( 0xADBEED, 1);
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 600;
				this.controls.lookSpeed = .4;
				this.controls.autoForward = false;
				this.camera.lookAt(100,-100,100);
			},
			
	setupWorld: function() {
				/*var floorTexture = new THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' );
				floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
				floorTexture.repeat.set( 10, 10 );
				var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side:THREE.BackSide } );
				var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
				var floor = new THREE.Mesh(floorGeometry, floorMaterial);
				floor.position.y = -0.5;
				floor.rotation.x = Math.PI / 2;
				this.scene.add(floor);*/
				var geometry = new THREE.CubeGeometry(1, 1, 1, 1);
				geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
				var floorgeo = new THREE.Geometry();
				
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
				
				var material = new THREE.MeshPhongMaterial({color: 0x444444});
				
				var floor = new THREE.Mesh(floorgeo, material);
				floor.castShadow = true;
				floor.receiveShadow = true;
				this.scene.add(floor);
				
				var materialArray = [];
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/defaultTexture.png' ) }));
				for (var i = 0; i < 6; i++)
				   materialArray[i].side = THREE.BackSide;
				var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
				var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
				var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
				this.scene.add( skybox );
				
				var sphereGeometry =  new THREE.SphereGeometry( 100, 32, 16 ); 
				var cubeGeometry = new THREE.CubeGeometry(50,50,50);
				
				this.mirrorEffectSphereCamera1 = new THREE.CubeCamera( 0.1, 5000, 512 );
				this.scene.add(this.mirrorEffectSphereCamera1);
				
				var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: this.mirrorEffectSphereCamera1.renderTarget } );
				this.mirrorEffectSphere1 = new THREE.Mesh( sphereGeometry, mirrorSphereMaterial );
				this.mirrorEffectSphere1.position.set(0,150,0);
				this.mirrorEffectSphereCamera1.position = this.mirrorEffectSphere1.position;
				this.scene.add(this.mirrorEffectSphere1);
				
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
				this.scene.add(lightTarget);
				spotlight.target = lightTarget;
				spotlight2.target = lightTarget;
				spotlight3.target = lightTarget;
				// must enable shadow casting ability for the light
				spotlight.castShadow = true;
				this.scene.add(spotlight);
				spotlight2.castShadow = true;
				this.scene.add(spotlight2);
				spotlight3.castShadow = true;
				this.scene.add(spotlight3);
			},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}
	
};