import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of triangle in X
 * @param y - Scale of triangle in Y
 * @param z - Scale of triangle in Z
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, 
                           y1, y2, y3,
                           z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
		this.z2 = z2;
        this.z3 = z3;
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1, //0
            this.x2, this.y2, this.z2, //0
			this.x3, this.y3, this.z3, //0

		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];

		this.normals = [];

		for(var i = 0; i< 3; i++){
			this.normals.push(0,0,1);
			//this.normals.push(-1,0,0);
		}

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

