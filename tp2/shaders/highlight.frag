precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float r;
uniform float g;
uniform float b;

void main() {
	gl_FragColor.r = r;
	gl_FragColor.g = g;
	gl_FragColor.b = b;
	gl_FragColor.a = 1.0;
}