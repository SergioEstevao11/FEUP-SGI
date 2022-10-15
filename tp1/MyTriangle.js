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

		this.initBuffers();

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

		//calculate normal
		let ab = [
			this.x1-this.x2, 
			this.y1-this.y2,
			this.z1-this.z2
		];
		let ac = [
			this.x1-this.x3, 
			this.y1-this.y3,
			this.z1-this.z3
		];

		let n = [
			ab[1]*ac[2] - ab[2]*ac[1],
			ab[2]*ac[0] - ab[0]*ac[2],
			ab[0]*ac[1] - ab[1]*ac[0]
		];

		for(let i=0; i<3; i++){
			this.normals.push(n[0], n[1], n[2])
		}
		
		this.a = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2));
		this.b = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2));
		this.c = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2));

		this.cosA = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2*this.a*this.c);
		this.sinA = Math.sqrt(1 - Math.pow(this.cosA, 2));

		this.texCoords = [
			0, 0,
			this.a, 0,
			this.c * this.cosA, this.c * this.sinA
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	 updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	changeTexCoords(length_s, length_t){
		for(let i = 0; i < this.texCoords.length; i++){
			if (i%2 ==0){
				this.texCoords[i] *= length_s;
			}
			else{
				this.texCoords[i] *= length_t;
			}
		}
	}

	resetTexCoords(){
		for(let i = 0; i < this.texCoords.length; i++){
			if (i%2 ==0){
				this.texCoords[i] /= length_s;
			}
			else{
				this.texCoords[i] /= length_t;
			}
		}
	}
}

