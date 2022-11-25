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

	float tvar = sin(timeFactor/2.0)/2.0 + 0.5;
	vec4 color = vFinalColor;

	if (uUseTexture)
	{
		vec4 colortex = texture2D(uSampler, vTextureCoord);

		gl_FragColor.r = color.r+(r-color.r)*colortex.r*tvar;
		gl_FragColor.g = color.g+(g-color.g)*colortex.g*tvar;
		gl_FragColor.b = color.b+(b-color.b)*colortex.b*tvar;
		gl_FragColor.a = color.a+(1.0-color.a)*colortex.a*tvar;
	}
	else
		gl_FragColor = color;

	
}
