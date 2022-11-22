precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float scale;

uniform float timeFactor;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vec4 position = vec4(0.0,0.0,0.0,0.0);

	vTextureCoord = aTextureCoord;

	offset=aVertexNormal*scale*sin(timeFactor/2.0);

	vec4 vertex=vec4(aVertexPosition+offset, 1.0);

	gl_Position = uPMatrix * uMVMatrix * vertex;
}