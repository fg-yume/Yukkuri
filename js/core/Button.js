/*
 * Button.js
 *
 * @author  Freddy Garcia
 *
 * A 2D sprite that can be clicked on in order to trigger a certain action
 */
 "use strict";
 
var app = app || {};

var BUTTON_STATE = {
	MAIN  : 0,
	HOVER : 1,
	CLICK : 2
};
 
app.Button = (function()
{
	// private ------------------------------------------------------------
	var STATE  = {
		MAIN   : 0,
		HOVER  : 1,
		CLICK  : 2
	};                     // States that the button can be in
	
	var CENTER = {
		X : 20,
		Y : 20,
		Z : -2
	};                     // Center of the sprite
	var SIZE   = {
		WIDTH : 45,
		HEIGHT: 45,
		DEPTH : 1
	};                     // Dimensions of the sprite
	
	var COLOR  = {
		MAIN   : 0x335577,
		HOVER  : 0x775533,
		CLICK  : 0xAABBCC
	};                     // Colors based on the different states
	
	// public -------------------------------------------------------------
	
	/*
	 * Creates a button using the given information
	 *
	 * @param    {Object} properties    the object containing the properties that define the button
	 *
	 */
	var Button = function(properties)
	{
		// Variables -------------
		this.center;
		this.size;
		this.color;
		this.click_callback;
		this.hover_callback;
		this.mesh;
		this.id
		
		this.currentState  = BUTTON_STATE.MAIN;
		this.previousState = BUTTON_STATE.MAIN;
		
		// Settings variables based on given values. Defaults are used in the case of missing values
		this.center = {
			x : (properties.center.x != undefined ? properties.center.x : CENTER.X),
			y : (properties.center.y != undefined ? properties.center.y : CENTER.Y),
			z : (properties.center.z != undefined ? properties.center.z : CENTER.Z)
		};
		
		this.size = {
			height : (properties.size.height != undefined ? properties.size.height : SIZE.HEIGHT),
			width  : (properties.size.width  != undefined ? properties.size.width  : SIZE.WIDTH),
			depth  : (properties.size.depth  != undefined ? properties.size.depth  : SIZE.DEPTH)
		};
		
		this.color = {
			main : (properties.color != undefined ? properties.color.main : COLOR.MAIN),
			hover: (properties.color != undefined ? properties.color.hover: COLOR.HOVER),
			click: (properties.color != undefined ? properties.color.click: COLOR.CLICK)
		};
		
		this.id = (properties.id != undefined ? properties.id : "default_sprite");
		
		// callbacks
		this.click_callback = (properties.click_callback != undefined ? properties.click_callback : console.log("no click callback defined!"));
		this.hover_callback = (properties.hover_callback != undefined ? properties.hover_callback : console.log("no hover callback defined!"));
		
		this.generateMesh();
	};
	
	/*
	 * Returns the sprite mesh of the button
	 *
	 * @return  the sprite mesh of the button 
	 */
	Button.prototype.getMesh = function()
	{
		return this.mesh;
	};
	
	/*
	 * Generates a sprite mesh based on the properties of the button
	 *
	 * @return  none
	 */
	Button.prototype.generateMesh = function()
	{
		var material = new THREE.SpriteMaterial( {color: this.color.main} );
		
		this.mesh = new THREE.Sprite(material);
		this.mesh.position.set(this.center.x - this.size.width / 2,
							this.center.y - this.size.height / 2,
							this.center.z - this.size.depth);
							
		this.mesh.scale.set(this.size.width, this.size.height, this.size.depth);
		
		Resources.addObject(this.mesh, this.id);
	};
	
	/*
	 * Changes the state of the game
	 *
	 * @param   {Object} state  the state to change the button to
	 *
	 * @return  none
	 */
	Button.prototype.changeState = function(state)
	{
		if(this.currentState == state)
		{
		}
			// do nothing
			
		else
		{
			this.previousState = this.currentState;
			this.currentState  = state;
		}
	};
	
	/*
	 * Updates the color of the mesh based on the current state of the
	 * button
	 *
	 * @return  none
	 */
	Button.prototype.update = function()
	{
		if(this.currentState == BUTTON_STATE.CLICK)
			this.mesh.material.color.setHex(this.color.click);
			
		else if(this.currentState == BUTTON_STATE.HOVER)
			this.mesh.material.color.setHex(this.color.hover);
			
		else
			this.mesh.material.color.setHex(this.color.main);
	};
	
	// public API
	return Button;
})();