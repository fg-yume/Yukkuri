/*
 * cameraTexture.js
 *
 * @author  Alex Mancillas
 *
 * cameraTexture experience
 */

"use strict";

var app = app || {};

app.cameraTexture = {
	camera: undefined,
	paused: false,
	dt: 1/60,
	controls: undefined,
	plane: undefined,
	ready: false,
	
	
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
	
	init : function() {
		console.log('init called');
		this.setupThreeJS();
		this.setupWorld();
	},
	setupThreeJS: function() {
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.y = 300;
		this.camera.position.z = 0;
		this.camera.position.x = -1200;
		
		app.main.renderer.setClearColor(0xADBEED);
		
		this.textureCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
		this.textureCamera.position.y = this.ccy;
		this.textureCamera.position.z =  this.ccz;
		this.textureCamera.position.x =  this.ccx;
		this.textureCamera.lookAt(new THREE.Vector3(0,0,0));
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
		SceneManager.addToScene(floor,"cameraTexture_floor");
		
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
		SceneManager.addToScene( skybox,"cameraTexture_skybox");
		
		var cubeGeometry = new THREE.CubeGeometry(40,40,40);
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
		this.cameraCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		this.cameraCube.position.x=this.ccx;
		this.cameraCube.position.y=this.ccy;
		this.cameraCube.position.z=this.ccz;
		SceneManager.addToScene( this.cameraCube,"cameraTexture_cameraCube");
		
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
		
		SceneManager.addToScene(this.textureCameraPlane,"cameraTexture_textureCameraPlane");
		SceneManager.addToScene(this.textureCameraPlane2,"cameraTexture_textureCameraPlane2");
		
		var planeGeo = new THREE.PlaneGeometry(1070,550,1,1);
		var planeMat = new THREE.MeshLambertMaterial({color: 0x000000});
		this.backplane = new THREE.Mesh(planeGeo,planeMat);
		this.backplane.rotation.y = -Math.PI/2;
		this.backplane.position.x = 510;
		this.backplane.position.z = 0;
		this.backplane.position.y = 500;
		SceneManager.addToScene(this.backplane,"cameraTexture_backplane");
		
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
		
		SceneManager.addToScene(light,"cameraTexture_light");
		
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
		SceneManager.addToScene(lightTarget,"cameraTexture_lightTarget");
		spotlight.target = lightTarget;
		spotlight2.target = lightTarget;
		spotlight3.target = lightTarget;
		// must enable shadow casting ability for the light
		spotlight.castShadow = true;
		SceneManager.addToScene(spotlight,"cameraTexture_spotlight");
		spotlight2.castShadow = true;
		SceneManager.addToScene(spotlight2,"cameraTexture_spotlight2");
		spotlight3.castShadow = true;
		SceneManager.addToScene(spotlight3,"cameraTexture_spotlight3");
		
		this.guiControls = new function()
		{
			this.speed = 1;
			this.distance = 1000;
			this.height = -450;
		};
		
		this.gui = new dat.GUI();
		this.gui.add(this.guiControls, 'speed', 0, 10);
		this.gui.add(this.guiControls, 'distance', 500, 2000);
		this.gui.add(this.guiControls, 'height', -900, 0);
		this.gui.open();
		
		this.ready = true;
	},
	update: function(){
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
	},
	render: function()
	{	
	
		this.textureCameraPlane.visible = false;
		this.textureCameraPlane2.visible = false;
		this.cameraCube.visible = false;
		this.backplane.visible = false;
		
		app.main.renderer.render(SceneManager.getScene(), this.textureCamera, this.renderTarget2, true);
		app.main.renderer.render(SceneManager.getScene(), this.camera, this.renderTarget, true);
		
		this.textureCameraPlane.visible = true;
		this.textureCameraPlane2.visible = true;
		this.cameraCube.visible = true;
		this.backplane.visible = true;
		app.main.renderer.render(SceneManager.getScene(), this.camera);
	}
};