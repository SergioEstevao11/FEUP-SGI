precision highp float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float stepM;
uniform float stepN;

uniform float M;
uniform float N;

varying vec2 vTextureCoord;

void main()
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord.x = (aTextureCoord.x * stepM) + (M * stepM);
    vTextureCoord.y = (aTextureCoord.y * stepN) + (N * stepN);
}