uniform sampler2D baseTexture;
uniform float baseSpeed;
uniform float repeatCol;
uniform float repeatRow;

uniform sampler2D noiseTexture;
uniform float noiseScale;

uniform sampler2D blendTexture;
uniform float blendSpeed;
uniform float blendOffset;

uniform float time;
uniform float alpha;

varying vec2 vUv;

void main() 
{
	vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;	
	vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
	vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );
	vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift * vec2 (repeatCol, repeatRow ) );

	vec2 uvTimeShift2 = vUv + vec2( 1.3, -1.7 ) * time * blendSpeed;	
	vec4 noiseGeneratorTimeShift2 = texture2D( noiseTexture, uvTimeShift2 );
	vec2 uvNoiseTimeShift2 = vUv + noiseScale * vec2( noiseGeneratorTimeShift2.g, noiseGeneratorTimeShift2.b );
	vec4 blendColor = texture2D( blendTexture, 
								uvNoiseTimeShift2 * vec2(repeatCol, repeatRow) )
									- blendOffset * vec4(1.0, 1.0, 1.0, 1.0);

	vec4 theColor = baseColor + blendColor;
	theColor.a = alpha;
	gl_FragColor = theColor;
}