/*
 * reflection.js
 *
 * @author  Alex Mancillas
 * @edit    Freddy Garcia
 *
 * cameraTexture experience
 */
 
 "use strict";

var app = app || {};

app.cameraTexture = {
	dt: 1/60,
	ccx: 0,
	ccy: -450,
	ccz: -1000,
	counter: 0,
	
	init : function() 
	{
		console.log('cameraTexture entry!');
		
		this.initThree();
		this.loadAndCreateAssets();
		this.createWorld();
	},
};