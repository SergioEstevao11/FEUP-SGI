
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vec4 position = vec4(0.0,0.0,0.0,0.0);

	vTextureCoord = aTextureCoord;

	vTextureCoord.x += timeFactor*0.01;
	vTextureCoord.y += timeFactor*0.02;

	offset=0.07*aVertexNormal*texture2D(uSampler2, vTextureCoord).b;


	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}