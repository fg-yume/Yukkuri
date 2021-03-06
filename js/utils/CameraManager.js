/*
 * CameraManager.js
 *
 * @author	Freddy Garcia
 *
 * Handles all camera-related things
 */

"use strict";

var CameraManager = {
	// Variables ----------------------------------------------------
	cameras			: new Array(), // contains available cameras
	activeCamera	: undefined,   // camera to use when rendering
	previousCamera	: undefined,   // previously active camera
	
	/*
	 * Returns the index of the cameras array that matches the key being searched. 
	 *
	 * @param	{String} key	the key of the camera to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	cameraExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
		
		// search for the key
		for(i = 0; i < this.cameras.length; i++)
		{
			// key exists
			if(this.cameras[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/*
	 * Adds the specified key/camera combination to the array of cameras
	 *
	 * @param   {Object} camera the camera to add
	 * @param	{String} key	the key of the camera to add
	 *
	 * @return	if the camera was successfully added
	 */
	addCamera : function(camera, key)
	{
		// camera exists
		if(this.cameraExists(key) != -1)
			return false;
		
		// camera doesn't exist
		key = key.toLowerCase();
		this.cameras.push({key: key, data: camera});
		
		return true;
	},
	
	/*
	 * Removes the specified camera from the array of cameras.
	 * If the camera is currently active, then the active camera is also reset.
	 *
	 * @param	{String} key	the key of the camera to remove
	 *
	 * @return	if the camera was successfully removed
	 */
	removeCamera : function(key)
	{
		var i;
		
		i = this.cameraExists(key);
	
		// camera exists
		if(i != -1)
		{
			key = key.toLowerCase();
			
			// reset active camera if necessary
			if(this.activeCamera.key == key)
				this.activeCamera = undefined;
				
			this.cameras.splice(i, 1);
			
			return true;
		}
		
		// camera doesn't exist
		return false;
	},
	
	/*
	 * Returns the specified camera. The active camera is returned if a 
	 * specific camera is not specified
	 *
	 * @param    {String} key   the key of the camera to return [Optional]
	 *
	 * @return   specified camera, or currently active camera
	 */
	getCamera : function(key)
	{
		// key was specified
		if(key != undefined)
		{
			var i;
			
			// look for camera
			i = this.cameraExists(key);
			
			// camera exists
			if(i != -1)
				return this.cameras[i].data;
				
			// camera doesn't exist
			return undefined;
		}
		
		// key was not specified
		else
		{
			// there's an active camera
			if(this.activeCamera != undefined)
				return this.activeCamera.data;
				
			// there's no active camera
			return undefined;
		}
	},
	
	/*
	 * Activates the camera with the specified key
	 *
	 * @param	{String} key	key of the camera to activate
	 *
	 * @return	if the camera was successfully activated
	 */
	activateCamera : function(key)
	{
		var i;
		
		// look for camera
		i = this.cameraExists(key);
	
		// camera exists
		if(i != -1)
		{
			// there's already an active camera
			if(this.activeCamera != undefined)
			{
				// camera is already active
				if(this.activeCamera.key == key)
				{
					// do nothing! :)
				}
				
				// camera isn't already active
				else
				{
					this.previousCamera = this.activeCamera;
					this.activeCamera = this.cameras[i];
				}
			}
			
			// no active camera
			else
			{
				this.activeCamera = this.cameras[i];
				this.previousCamera = this.activeCamera;	
			}
			
			return true;
		}
		
		// camera doesn't exist
		return false;
	},
	
	/*
	 * Modifies the specified camera with the given properties
	 *
	 * @param	{Object} properties	the properties to modify in the camera
	 * @param	{String} key		the key of the camera to modify (Optional)
	 *
	 * @return	if the camera was successfully modified
	 */
	modifyCamera : function(properties, key)
	{
		// specific camera to modify
		if(key)
		{
			var i;
			
			// look for camera
			i = this.cameraExists(key);
			
			// camera exists
			if(i != -1)
			{
				// position
				if(properties.position)
				{
					this.cameras[i].data.position.x = properties.position.x;
					this.cameras[i].data.position.y = properties.position.y;
					this.cameras[i].data.position.z = properties.position.z;
				}
				
				// translation
				if(properties.translate)
				{
					this.cameras[i].data.position.x += properties.translate.x;
					this.cameras[i].data.position.y += properties.translate.y;
					this.cameras[i].data.position.z += properties.translate.z;
				}
				
				// lookAt
				if(properties.lookAt)
					this.cameras[i].data.lookAt(properties.lookAt);
					
				// rotation
				
				return true;
			}
			
			// camera doesn't exist
			return false;
		}
		
		// key not provided - use current camera
		// useful when calling this function from events such as resize()
		else
		{
			// there's an active camera
			if(this.activeCamera != undefined)
			{
				// position
				if(properties.position)
				{
					this.activeCamera[i].data.position.x = properties.position.x;
					this.activeCamera[i].data.position.y = properties.position.y;
					this.activeCamera[i].data.position.z = properties.position.z;
				}
				
				// translation
				if(properties.translate)
				{
					this.activeCamera[i].data.position.x += properties.translate.x;
					this.activeCamera[i].data.position.y += properties.translate.y;
					this.activeCamera[i].data.position.z += properties.translate.z;
				}
				
				return true;
			}
			
			// there's no active camera
			return false;
		}
	}
};