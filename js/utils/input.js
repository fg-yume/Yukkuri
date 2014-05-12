"use strict";

var Input = {
	mouseX	: 0,
	mouseY	: 0,
	keyboard: undefined, // will contain all of the keyboard event handlers
	
	/*
	 * Updates the current position of the mouse 
	 *
	 * @param	{Event}	event	the mouse event that called this function
	 *
	 * @return	none
	 */
	updateMouse : function(event)
	{
		this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
	}
};