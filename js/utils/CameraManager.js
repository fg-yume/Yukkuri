"use strict";

var CameraManager = {
	var cameras			: undefined, // holds a list of the available cameras
	var activeCamera	: undefined, // the camera to use when rendering
	var previousCamera	: undefined, // the previous active camera
	
	/*
	 * Returns the index of the cameras array that matches the key being searched. 
	 *
	 * @param	{String} key	the key of the camera to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	cameraExists : function(type, key)
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
	 * Activates the camera with the specified key
	 *
	 * @param	{String} key	key of the camera to activate
	 *
	 * @return					if the camera was successfully activated
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
			if(this.activeCamera)
			{
				this.previousCamera = this.activeCamera;
				this.activeCamera = this.cameras[i].data;
				
				return true;
			}
			
			// no active camera
			else
			{
				this.activeCamera = this.cameras[i].data;
				this.previousCamera = this.activeCamera;
				
				return true;
			}
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
	 * @return						if the camera was successfully modified
	 */
	modifyCamera(properties, key)
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
				// set position
				if(properties.position)
				{
					this.cameras[i].position.x = properties.position.x;
					this.cameras[i].position.y = properties.position.y;
					this.cameras[i].position.z = properties.position.z;
				}
				
				// translation
				if(properties.translate)
				{
					this.cameras[i].position.x += properties.translate.x;
					this.cameras[i].position.y += properties.translate.y;
					this.cameras[i].position.z += properties.translate.z;
				}
				
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
			if(this.activeCamera)
			{
			}
			
			// there's no active camera
			return false;
		}
	}
};