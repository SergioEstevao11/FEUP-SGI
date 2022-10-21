import {CGFobject} from '../../lib/CGF.js';

 /**
   * MyCylinder
   * @constructor
   * @param scene - MyScene object
   * @param base - base radius
   * @param top - top radius
   * @param height - height of the cylinder
   * @param slices - number of slices around Z axis
   * @param stacks - number of stacks along Z axis
   */
export class MyCylinder extends CGFobject {
  constructor(scene, base, top, height, slices, stacks) {
    super(scene);
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the cylinder buffers
   */
   initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    let ang = 0;
    let alphaAng = 2*Math.PI/this.slices;
    let stackradius = this.base;

    for (var stack = 0; stack < this.stacks+1; stack++) {
      for(var slice = 0; slice < this.slices+1; slice++) {
          let x = Math.cos(ang)*stackradius;
          let y = Math.sin(ang)*stackradius;
          let z = stack*this.height/this.stacks;
          this.vertices.push(x, y, z);
          this.normals.push(Math.cos(ang), Math.sin(ang), (this.base-this.top)/this.height);//normalize
          this.texCoords.push(slice/this.slices, 1-stack/(2*this.stacks));
          ang+=alphaAng;
          stackradius = this.base - (this.base-this.top)*stack/this.stacks;
      }
      ang=0;
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for(let slice = 0; slice < this.slices; slice++) {
        let a = (this.slices+1)*stack + slice;
        let b = a+1;
        let c = (this.slices+1)*(stack+1)+slice;
        let d = c+1;
        this.indices.push(a, d, c);
        this.indices.push(a, b, d);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  changeTexCoords(length_s, length_t){
		// for(let i = 0; i < this.texCoords.length; i++){
		// 	if (i%2 ==0){
		// 		this.texCoords[i] *= length_s;
		// 	}
		// 	else{
		// 		this.texCoords[i] *= length_t;
		// 	}
		// }
    // this.initGLBuffers();
    return;
	}

	resetTexCoords(){
		// for(let i = 0; i < this.texCoords.length; i++){
		// 	if (i%2 ==0){
		// 		this.texCoords[i] /= length_s;
		// 	}
		// 	else{
		// 		this.texCoords[i] /= length_t;
		// 	}
		// }
    // this.initGLBuffers();
    return;
	}
}