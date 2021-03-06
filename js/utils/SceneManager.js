/*
 * SceneManager.js
 *
 * @author	Freddy Garcia
 *
 * Handles functionality for the scenes that will be used in the experiments
 */
 
"use strict";
 
var SceneManager = {
	// Variables ---------------------------------------------------------
	scenes        : new Array(), // contains THREE.Scene objects
	previousScene : undefined,   // previously active scene
	activeScene   : undefined,   // currently active scene
	
	/*
	 * Returns the index of the scenes array that matches the key being searched.
	 *
	 * @param    {String} key    the key of the scene to search for
	 *
	 * @return   {Number}        the index that matches the key being searched. Returns -1 if the key was not matched. 
	 */
	sceneExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
		
		// search or the key
		for(i = 0; i < this.scenes.length; i++)
		{
			// key exists
			if(this.scenes[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/* 
	 * Adds the specified key/scene combination to the array of scenes
	 *
	 * @param    {THREE.Scene} scene        the scene to add
	 * @param    {String} key               the key of the scene to add
	 *
	 * @return   if the scene was successfully added
	 */
	addScene : function(scene, key)
	{
		// scene exists
		if(this.sceneExists(key) != -1)
			return false;
			
		// scene doesn't exist
		key = key.toLowerCase();
		this.scenes.push({key: key, data: scene});
		
		return true;
	},
	
	/*
	 * Removes the specified scene from the array of scenes
	 *
	 * @param    {String} key   the key of the scene to remove
	 * 
	 * @return   if the scene was successfully removed
	 */
	removeScene : function(key)
	{
		var i;
		
		i = this.sceneExists(key);
		
		// scene exists
		if(i != -1)
		{
			key = key.toLowerCase();
			
			// reset active scene if necessary
			if(this.activeScene.key == key)
				this.activeScene = undefined;
			
			// TODO: remove all objects from the scene
			
			this.scenes.splice(i, 1);
			
			return true;
		}
		
		// scene doesn't exist
		return false;
	},
	
	/*
	 * Activates the scene with the given key
	 *
	 * @param    {String} key   key of the scene to activate
	 *
	 * @return   if the scene was successfully activated
	 */
	activateScene : function(key)
	{
		var i;
		
		// look for scene
		i = this.sceneExists(key);
		
		// scene exists
		if(i != -1)
		{
			// there's already an active camera
			if(this.activeScene != undefined)
			{
				// scene is already active
				if(this.activeScene.key == key)
				{
					// do nothing!
				}
				
				// scene isn't already active
				else
				{
					this.previousScene = this.activeScene;
					this.activeScene   = this.scenes[i];
				}
			}
			
			// no active camera
			else
			{
				this.activeScene   = this.scenes[i];
				this.previousScene = this.activeScene;
			}
			
			return true;
		}
		
		// scene doesn't exist
		return false;
	},
	
	/*
	 * Returns the specified scene. If no scene is specified,
	 * the currently active scene is returned
	 *
	 * @param
	 *
	 * @return   specified scene or currently active scene. Returns undefined if there scene is not found
	 */
	getScene : function(key)
	{
		// scene was specified
		if(key != undefined)
		{
			var i;
			
			i = this.sceneExists(key);
			
			// scene exists
			if(i != -1)
				return this.scenes[i].data;
				
			// scene doesn't exist
			return undefined;
		}
		
		// scene wasn't specified - use active scene
		else
		{
			// there's an active scene
			if(this.activeScene != undefined)
				return this.activeScene.data;
				
			// there's no active scene
			return undefined;
		}
	},
	
	/*
	 * Removes an object from the specified scene. If no scene is specified, removes from the currently active scene
	 *
	 * @param    {THREE.Object3D} object    the object to remove
	 * @param    {String} key               the key of the scene to remove the object from. [Optional]
	 *
	 * @return   if the object was successfully removed
	 */
	removeFromScene : function(object, key)
	{
		// key specified
		if(key != undefined)
		{
			var i;
			
			// look for scene
			i = this.sceneExists(key);
			
			if(i != -1)
			{
				// TODO: Check if object actually exists!
			
				// remove from scene
				this.scenes[i].data.remove(object);
				return true;
			}
			
			// scene doesn't exist
			return false;
		}
		
		// key wasn't specified
		else
		{
			// there's an active scene
			if(this.activeScene != undefined)
			{
				this.activeScene.data.remove(object);
				return true;
			}
		
			// there's no active scene
			return false;
		}
	},
	
	/*
	 * Adds an object to the specified scene. If no scene is specified, the object is added to the currently active scene
	 *
	 * @param    {THREE.Object3D} object    the object to add
	 * @param    {String} key               the key of the scene to add the object to [Optional]
	 *
	 * @return   if the object was successfully added
	 */
	addToScene : function(object, key)
	{
		// key specified
		if(key != undefined)
		{
			var i;
			
			// look for scene
			i = this.sceneExists(key);
			
			// scene exists
			if(i != -1)
			{
				// TODO: Check if object actually exists!
				
				// add to scene
				this.scenes[i].data.add(object);
				return true;
			}
			
			// scene doesn't exist
			return false;
		}
		
		// key not specified
		else
		{
			// there's an active scene
			if(this.activeScene != undefined)
			{
				this.activeScene.data.add(object);
				return true;
			}
				
			// there's no active scene
			return false;
		}
	}
};