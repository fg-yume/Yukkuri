"use strict";

var app = app || {};

app.test = {
		renderer: undefined,
		scene: undefined,
		camera: undefined,
		paused: false,
		dt: 1/60,
		controls: undefined,
		plane: undefined,
		
		
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
		
		//screenscene = new THREE.Scene();

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
		
		this.changePosition();

		// DRAW	
		this.textureCameraPlane.visible = false;
		this.textureCameraPlane2.visible = false;
		this.cameraCube.visible = false;
		this.backplane.visible = false;
		
		this.renderer.render(this.scene, this.textureCamera, this.renderTarget2, true);
		this.renderer.render(this.scene, this.camera, this.renderTarget, true);
		
		this.textureCameraPlane.visible = true;
		this.textureCameraPlane2.visible = true;
		this.cameraCube.visible = true;
		this.backplane.visible = true;
		this.renderer.render(this.scene, this.camera);
		
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0xADBEED, 0.002);

				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.y = 300;
				this.camera.position.z = 0;
				this.camera.position.x = -1200;
				
				this.textureCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.textureCamera.position.y = this.ccy;
				this.textureCamera.position.z =  this.ccz;
				this.textureCamera.position.x =  this.ccx;
				this.textureCamera.lookAt(new THREE.Vector3(0,0,0));
				
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
				var geometry = new THREE.CubeGeometry(1, 1, 1, 1);
				geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
				var floorgeo = new THREE.Geometry();
				
				for(var ix = 0; ix < 5; ix++)
				{
					for(var iy = 0; iy < 5; iy++)
					{
						var s = new THREE.Mesh(new THREE.SphereGeometry(50,12,12), new THREE.MeshLambertMaterial({color: 0x7777ff}));
						s.position.x = (Math.random() * 1000 - 500);
						s.position.y = (Math.random() * 1000 - 700);
						s.position.z = (Math.random() * 1000 - 500);
						
						THREE.GeometryUtils.merge(floorgeo, s);
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
				
				var cubeGeometry = new THREE.CubeGeometry(40,40,40);
				var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
				this.cameraCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
				this.cameraCube.position.x=this.ccx;
				this.cameraCube.position.y=this.ccy;
				this.cameraCube.position.z=this.ccz;
				this.scene.add( this.cameraCube );
				
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
				
				this.scene.add(this.textureCameraPlane);
				this.scene.add(this.textureCameraPlane2);
				
				var planeGeo = new THREE.PlaneGeometry(1070,550,1,1);
				var planeMat = new THREE.MeshLambertMaterial({color: 0x000000});
				this.backplane = new THREE.Mesh(planeGeo,planeMat);
				this.backplane.rotation.y = -Math.PI/2;
				this.backplane.position.x = 510;
				this.backplane.position.z = 0;
				this.backplane.position.y = 500;
				this.scene.add(this.backplane);
				
				var light = new THREE.DirectionalLight(0xffffff,4);
				light.position.set(500,500,500);
				light.castShadow = true;
				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				//light.shadowCameraVisible	= true;
				
				var d = 1000;
				light.shadowCameraLeft = d;
				light.shadowCameraTop = d;
				
				light.shadowCameraRight = -d;
				light.shadowCameraBottom = -d;
				
				light.shadowCameraFar = 2500;
				
				this.scene.add(light);
				
				var spotlight = new THREE.SpotLight(0xffff00);
				spotlight.position.set(-500,500,-500);
				//spotlight.shadowCameraVisible = true;
				spotlight.shadowDarkness = 0.95;
				spotlight.intensity = 1;
				var spotlight2 = new THREE.SpotLight(0xff00ff);
				spotlight2.position.set(500,500,-500);
				//spotlight2.shadowCameraVisible = true;
				spotlight2.shadowDarkness = 0.95;
				spotlight2.intensity = 1;
				var spotlight3 = new THREE.SpotLight(0x00ffff);
				spotlight3.position.set(-500,500,500);
				//spotlight3.shadowCameraVisible = true;
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

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},
	changePosition: function(){
		//this.guiControls.update();
	
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
	}
	
};