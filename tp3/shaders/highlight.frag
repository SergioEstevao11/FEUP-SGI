precision highp float;

varying vec4 vFinalColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform float r;
uniform float g;
uniform float b;

uniform float timeFactor;

void main() {

	float tvar = sin(timeFactor/2.0)*sin(timeFactor/2.0);
	vec4 initialColor;

	if (uUseTexture)
	{
		vec4 colortex = texture2D(uSampler, vTextureCoord);
		initialColor = colortex  * vFinalColor;
	}
	else
		initialColor = vFinalColor;

	gl_FragColor = mix(initialColor, vec4(r,g,b,1.0), tvar);

	
}
