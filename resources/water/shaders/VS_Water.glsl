varying vec2 vUv;

void main() 
{ 
	//lets keep the vertices as is, they are altered via the update back in test.js
	vUv = uv;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position,
	1.0 );
}