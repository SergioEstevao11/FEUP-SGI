precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float r;
uniform float g;
uniform float b;

uniform vec4 matcolor;

uniform float timeFactor;

void main() {
	vec4 colortex = texture2D(uSampler, vTextureCoord);

	vec4 color = matcolor * colortex;
	
	gl_FragColor.r = color.r+(r-color.r)*(sin(timeFactor/2.0)/2.0 + 0.5);
	gl_FragColor.g = color.g+(g-color.g)*(sin(timeFactor/2.0)/2.0 + 0.5);
	gl_FragColor.b = color.b+(b-color.b)*(sin(timeFactor/2.0)/2.0 + 0.5);
	gl_FragColor.a = 1.0;
}
