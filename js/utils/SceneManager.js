/*
 * SceneManager.js
 *
 * @author	Freddy Garcia
 *
 * Handles functionality for the scenes that will be used in the experiments
 */
 
"use strict";
 
var SceneManager = {
	var scenes        = undefined, // holds the array of all THREE.Scene objects
	var previousScene = undefined, // the previous active scene
	var activeScene   = undefined, // the currently active scene
	
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
	 * @param    {String} key               the key of the scene to add
	 * @param    {THREE.Scene} scene        the scene to add
	 *
	 * @return   if the scene was successfully added
	 */
	addScene : function(key, scene)
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
	
	// TODO
	activateScene : function(key)
	{
	},
	
	// TODO
	removeFromScene : function(key, object)
	{
	},
	
	// TODO
	addToScene : function(key, object)
	{
	}
};