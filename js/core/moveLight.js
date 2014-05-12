/*
 * moveLight.js
 *
 * @author	Freddy Garcia
 *
 * Object containing 
 */
 
"use strict";

var lizard = lizard || {};

/*
 * Creates a Object3D which contains a point light as well as a sphere
 * surrounding the light
 *
 * @param	{Object} lightParameters	the object containing parameters that define the light to be created
 * @param	{Object} sphereParameters	the object containing parameters that define the sphere to be created
 *
 * @return	{THREE.Object3D} the newly created object
 */
lizard.MoveLight = function(lightParameters, sphereParameters)
{
	// Constants -----------------------------------------------
	var LIGHT_DEFAULT_COLOR		= 0x000000;
	var LIGHT_DEFAULT_INTENSITY	= 0.5;
	var LIGHT_DEFAULT_DISTANCE	= 50;
	var SPHERE_DEFAULT_RADIUS	= 5;
	var SPHERE_DEFAULT_SEGMENTS	= 15;

	// variables -------------------------------------------------------------
	var moveLight;	// object that will contain both the light and the sphere
	var light;		// point light component of the MoveLight
	var sphere;		// sphere component of the MoveLight
	
	// properties ------------------------------------------------------------
	var color;		// color of the light
	var intensity;	// intensity of the light
	var distance;	// distance the light can reach
	var radius;		// radius of the sphere
	var segments;	// number of vertical and horizontal segments for the sphere
	var geo_sphere;	// geometry for the sphere
	
	// light
	color 		= lightParameters.color ? lightParameters.color : LIGHT_DEFAULT_COLOR;
	intensity	= lightParameters.intensity ? lightParameters.intensity : LIGHT_DEFAULT_INTENSITY;
	distance	= lightParameters.distance ? lightParameters.distance : LIGHT_DEFAULT_DISTANCE;
	
	light = new THREE.PointLight(color, intensity, distance);
	
	// sphere
	radius		= sphereParameters.radius ? sphereParameters.radius : SPHERE_DEFAULT_RADIUS;
	segments	= sphereParameters.segments ? sphereParameters.segments : SPHERE_DEFAULT_SEGMENTS;
	
	geo_sphere	= new THREE.SphereGeometry(radius, segments, segments);
	
	sphere = THREE.SceneUtils.createMultiMaterialObject(
		geo_sphere,
		[lizard.Resources.getMaterial("dark"), lizard.Resources.getMaterial("wireframe")]);
		
	// move light
	moveLight = new THREE.Object3D();
	moveLight.add(light);
	moveLight.add(sphere);

	return moveLight;
};