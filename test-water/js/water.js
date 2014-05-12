// test.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.test = {
    	// CONSTANT properties
    	
		// variable properties
		renderer: undefined,
		scene: undefined,
		camera: undefined,
		myobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,
		geo: undefined,
		
		plane: undefined,
		ox: [],
		oy: [],
		or: [],
		oz: [],
		customUniforms: undefined,
		customMaterial: undefined,
		
		geo2: undefined,
		showGrid: true,
		gridplane: undefined,
		
		count: 0.0,
		
		
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

		//////////////////////////////////////////////////////////////////////
		for(var i = 0; i < this.geo.vertices.length;i++)
		{
			this.geo.vertices[i].x = this.ox[i] +(Math.sin((this.count + this.or[i])/100 * Math.PI)*3);
			this.geo.vertices[i].y = this.oy[i] +(Math.cos((this.count + this.or[i])/100 * Math.PI)*3);
			//this.geo.vertices[i].z = (this.oz[i]*1000) -(Math.sin((this.count + this.or[i])/50 * Math.PI)*5);
			this.geo.vertices[i].z = -(Math.sin(((i+this.count)/400)*Math.PI) * 10);
			
			if(this.showGrid)
			{
				this.geo2.vertices[i].x = this.geo.vertices[i].x;
				this.geo2.vertices[i].y = this.geo.vertices[i].y;
				this.geo2.vertices[i].z = this.geo.vertices[i].z + 400;
			}
		}
		this.count+=2;
		this.geo.verticesNeedUpdate = true;
		if(this.showGrid)
		{
			this.geo2.verticesNeedUpdate = true;
		}
		//////////////////////////////////////////////////////////////////////
		
		this.customUniforms.time.value += this.dt;
		
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
				this.renderer.setClearColor( 0x000000, 1);
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 300;
				this.controls.lookSpeed = .2;
				this.controls.autoForward = false;
				this.camera.lookAt(100,-100,100);
				
				//THREE.ImageUtils.crossOrigin = "anonymous";
			},
			
	setupWorld: function() {

				var baseTexture = new THREE.ImageUtils.loadTexture( "images/water.jpg" );
				baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping; 

				var noiseTexture = new THREE.ImageUtils.loadTexture( "images/noise1.png" );
				noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 

				var blendTexture = new THREE.ImageUtils.loadTexture( "images/waterblend.png" );
				blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
				
				this.customUniforms = {
					baseTexture: 	{ type: "t", value: baseTexture },
					noiseTexture:	{ type: "t", value: noiseTexture },
					blendTexture:	{ type: "t", value: blendTexture },
					
					baseSpeed:		{ type: "f", value: 0.001 },
					
					repeatCol:		{ type: "f", value: 4 },
					repeatRow:		{ type: "f", value: 4 },
					
					noiseScale:		{ type: "f", value:  .8 },
					
					blendSpeed: 	{ type: "f", value: 0.01 },
					blendOffset: 	{ type: "f", value: 0.6 },
					
					alpha: 			{ type: "f", value: 1.0 },
					time: 			{ type: "f", value: 1.0 }
				};
				
				
				this.geo = new THREE.PlaneGeometry(1000,1000,49,49);
				
				this.customMaterial = new THREE.ShaderMaterial( 
				{
					uniforms: this.customUniforms,
					vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent
				}   );
				
				for(var i = 0; i < this.geo.vertices.length;i++)
				{
					this.ox[i] = this.geo.vertices[i].x;
					this.oy[i] = this.geo.vertices[i].y;
					this.oz[i] = -Math.sin((i%50)*Math.PI);
					this.or[i] = Math.random() * 1000;
				}
				
				this.plane = new THREE.Mesh(this.geo,this.customMaterial);
				
				this.plane.rotation.x=-0.5*Math.PI;
				
				this.scene.add(this.plane);
				
				if(this.showGrid)
				{
					this.geo2 = new THREE.PlaneGeometry(1000,1000,49,49);
					var mat = new THREE.MeshPhongMaterial({color: 0x666666, wireframe: true});
					
					this.gridplane = new THREE.Mesh(this.geo2,mat);
					this.gridplane.rotation.x=-0.5*Math.PI;
					this.scene.add(this.gridplane);
				}
				
				var materialArray = [];
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/checker.png' ) }));
				for (var i = 0; i < 6; i++)
				   materialArray[i].side = THREE.BackSide;
				var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
				var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
				var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
				this.scene.add( skybox );
				
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
				
				console.log(this.geo.vertices.length);
				
				var pointlight = new THREE.PointLight(0xffffff, 1, 100 );
				pointlight.position.set(0,600,0);
				pointlight.shadowCameraVisible	= true;
				this.scene.add(pointlight);
			},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}
	
};