/*
 * resources.js
 *
 * @author	Freddy Garcia
 *
 * Contains arrays of pre-made objects to be used in the application as well as methods 
 * to add, remove, and get any object in the arrays.
 */
 
"use strict";

var Resources = {
	// Variables ----------------------------------------------------
	materials	: new Array(),				// contains pre-built materials
	geometries	: new Array(),				// contains pre-built geometries
	textures	: new Array(),				// contains pre-built textures
	objects		: new Array(),				// contains pre-built Object 3Ds
	
	/*
	 * Returns the index of the materials array that matches the key being searched
	 *
	 * @param	{String} key	the key of the material to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	materialExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
	
		for(i = 0; i < this.materials.length; i++)
		{
			// key exists
			if(this.materials[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/*
	 * Returns the index of the geometries array that matches the key being searched
	 *
	 * @param	{String} key	the key of the geometry to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	geometryExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
	
		for(i = 0; i < this.geometries.length; i++)
		{
			// key exists
			if(this.geometries[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/*
	 * Returns the index of the textures array that matches the key being searched
	 *
	 * @param	{String} key	the key of the texture to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	textureExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
		
		for(i = 0; i < this.textures.length; i++)
		{
			// key exists
			if(this.textures[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/*
	 * Returns the index of the objects array that matches the key being searched
	 *
	 * @param	{String} key	the key of the object to search for
	 *
	 * @return	{Number}		the index that matches the key being searched. Returns -1 if key was not matched
	 */
	objectExists : function(key)
	{
		var i;
		
		// case insensitive
		key = key.toLowerCase();
		
		for(i = 0; i < this.objects.length; i++)
		{
			// key exists
			if(this.objects[i].key == key)
				return i;
		}
		
		// key doesn't exist
		return -1;
	},
	
	/*
	 * Returns the material that matches the specified key
	 *
	 * @param	{String} key	the key for the material that will be returned
	 *
	 * @return	{Material} 		the material matching the specified key
	 */
	getMaterial : function(key)
	{
		var i;
		
		// look for material
		i = this.materialExists(key);
		
		// material exists
		if(i != -1)
			return this.materials[i].data;
		
		// material doesn't exist
		return undefined;
	},
	
	/*
	 * Returns the geometry that matches the specified key
	 *
	 * @param	{String} key	the key for the geometry that will be returned
	 *
	 * @return	{Geometry} 		the geometry matching the specified key
	 */
	getGeometry : function(key)
	{
		var i;
		
		// look for geometry
		i = this.geometryExists(key);
		
		// geometry exists
		if(i != -1)
			return this.geometries[i].data;
		
		// geometry doesn't exist
		return undefined;
	},
	
	/*
	 * Returns the texture that matches the specified key
	 *
	 * @param	{String} key	the key for the texture that will be returned
	 *
	 * @return	{Texture}		the texture matching the specified key
	 */
	getTexture : function(key)
	{
		var i;
		
		// look for texture
		i = this.textureExists(key);
		
		// texture exists
		if(i != -1)
			return this.textures[i].data;
			
		// texture doesn't exist
		return undefined;
	},
	
	/*
	 * Returns the object that matches the specified key
	 *
	 * @param	{String} key	the key for the object that will be returned
	 *
	 * @return	{Object 3D}		the object matching the specified key
	 */
	getObject : function(key)
	{
		var i;
		
		// look for object
		i = this.objectExist(key);
		
		// object exists
		if(i != -1)
			return this.objects[i].data;
			
		// object doesn't exist
		return undefined;
	},
	
	/*
	 * Adds the specified material/key combination to the materials array
	 *
	 * @param	{String} key		the key of the material being added
	 * @param	{Material} material	the material being added
	 *
	 * @return	{BOOL}				if the material was successfully added
	 */
	addMaterial : function(key, material)
	{
		// material already exists
		if(this.materialExists(key) != -1)
			return false;
		
		// material doesn't exist
		key = key.toLowerCase();
		this.materials.push({key: key, data: material});
		return true;
	},
	
	/*
	 * Adds the specified geometry/key combination to the geometry array
	 *
	 * @param	{String} key		the key of the geometry being added
	 * @param	{Geometry} geometry	the geometry being added
	 *
	 * @return	{BOOL}				if the geometry was successfully added
	 */
	addGeometry : function(key, geometry)
	{
		// geometry already exists
		if(this.geometryExists(key) != -1)
			return false;
		
		// geometry doesn't exist
		key = key.toLowerCase();
		this.geometries.push({key: key, data: geometry});
		return true;
	},
	
	/*
	 * Adds the specified key/texture combination to the texture array
	 *
	 * @param	{String} key		the key of the texture being added
	 * @param	{Texture} texture	the texture being added
	 *
	 * @return	{BOOL}				if the texture was successfully added
	 */
	addTexture : function(key, texture)
	{
		// texture already exists
		if(this.textureExists(key) != -1)
			return false;
			
		// texture doesn't exist
		key = key.toLowerCase();
		this.textures.push({key: key, data: texture});
		return true;
	},
	
	/*
	 * Adds the specified key/object combination to the object array.
	 * Additionally, the object can also be added to a THREE.Scene
	 *
	 * @param	{String} key		the key of the object being added
	 * @param	{Object 3D} object	the object being added
	 * @param	{THREE.Scene} scene	the scene to add the object to (optional)
	 *
	 * @return	{BOOL}				if the object was successfully added
	 */
	addObject : function(key, object, scene)
	{
		// object already exists
		if(this.objectExists(key) != -1)
			return false
			
		// object doesn't exist
		key = key.toLowerCase();
		this.objects.push({key: key, data: object});
		
		if(scene)
			scene.add(object);
			
		return true;
	},
	
	/*
	 * Removes the material with the specified key
	 *
	 * @param	{String} key	the key of the material to be removed
	 *
	 * @return	{BOOL}			if the material was successfully removed
	 */
	removeMaterial : function(key)
	{
		var i;
	
		// look for material
		i = materialExists(key);
		
		// material exists
		if(i != -1)
		{
			this.materials.splice(i, 1);
			return true;
		}
		
		// material doesn't exist
		return false;
	},
	
	/*
	 * Removes the geometry with the specified key
	 *
	 * @param	{String} key	the key of the geometry to be removed
	 * 
	 * @return	{BOOL}			if the geometry was successfully removed
	 */
	removeGeometry : function(key)
	{
		var i;
	
		// look for geometry
		i = geometryExists(key);
		
		// geometry exists
		if(i != -1)
		{
			this.geometries.splice(i, 1);
			return true;
		}
			
		// geometry doesn't exist
		return false;
	},
	
	/*
	 * Removes the texture with the specified key
	 *
	 * @param	{String} key	the key of the texture to be removed
	 *
	 * @return	{BOOL}			if the texture was successfully removed
	 */
	removeTexture : function(key)
	{
		var i;
		
		// look for texture
		i = textureExists(key);
		
		// texture exists
		if(i != -1)
		{
			this.textures.splice(i, 1);
			return true;
		}
		
		// texture doesn't exist
		return false;
	},
	 
	 /*
	  * Removes the object with the specified key.
	  * Additionally, the object can also be removed from a THREE.Scene
	  *
	  * @param	{String} key		the key of the object to be removed
	  * @param	{THREE.Scene} scene	the scene to remove the object from
	  *
	  * @return	{BOOL}				if the object was successfully removed
	  */
	removeObject : function(key, scene)
	{
		var i;
		
		// look for object
		i = objectExists(key);
		
		// object exists
		if(i != -1)
		{
			// remove from scene if provided
			if(scene)
				scene.remove(this.objects[i].data);
				
			this.objects.splice(i, 1);
			return true;
		}
	
		// object doesn't exist
		return false;
	},
	
	/*
	 * Removes the object with the specified key from the screen. Does not remove the object from the array
	 *
	 * @param	{String} key		the key of the object to be removed
	 * @param	{THREE.Scene} scene	the scene to remove the object from
	 *
	 * @return	{BOOL}				if the object was successfully removed
	 */
	 removeFromScene : function(key, scene)
	 {
		var i;
		
		// look for object
		i = objectExists(key);
		
		// object exists 
		if(i != -1)
		{
			scene.remove(this.objects[i].data);
			return true;
		}
		
		// object doesn't exist
		return false;
	 }
};