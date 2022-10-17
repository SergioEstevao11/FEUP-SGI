import {CGFobject} from '../lib/CGF.js';

export class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;
    this.latDivs = stacks * 2;
    this.longDivs = slices;

    this.initBuffers();
  }

    /**
   * @method initBuffers
   * Initializes the sphere buffers
   */
  initBuffers() {
		this.vertices  = [];
		this.texCoords = [];
    this.indices   = [];
    this.normals = [];

    let theta=0.5*Math.PI;
    let phi=0;

		for(let latitude = 0; latitude <= this.latDivs; latitude++){
			let t = latitude/this.latDivs;
			for(let longitude = 0; longitude <= this.slices; longitude++){
    		let x = Math.cos(theta) * Math.cos(phi);
				let y = Math.cos(theta) * Math.sin(phi);
				let z = Math.sin(theta);
				this.vertices.push(this.radius*x, this.radius*y, this.radius*z);
        this.normals.push(x,y,z);

				let s = longitude/this.longDivs;
				this.texCoords.push(s, t);
        phi+=2*Math.PI/this.longDivs;
			}
      theta-=Math.PI/this.latDivs;
      phi=0;
		}
		
		for(let stack = 0; stack < this.latDivs; stack++){
			let base1 = (this.longDivs+1) * stack;
			let base2 = (this.longDivs+1) * (stack+1);
			for(let i = base1, j = base1 + 1, k = base2, l = base2+1; j < base2; ++i, ++j, ++k, ++l){
				this.indices.push(i, k, l);
				this.indices.push(i, l, j);
			}
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

  		/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
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
      this.initGLBuffers();

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
      this.initGLBuffers();
  }
}
