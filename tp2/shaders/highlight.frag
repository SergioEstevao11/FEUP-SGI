precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float r;
uniform float g;
uniform float b;

uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	gl_FragColor.r = abs(r-color.r)*(sin(timeFactor)+1.0);
	gl_FragColor.g = abs(g-color.g)*(sin(timeFactor)+1.0);
	gl_FragColor.b = abs(b-color.b)*(sin(timeFactor)+1.0);
	gl_FragColor.a = 1.0;
}
