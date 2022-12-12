import {CGFobject} from '../../lib/CGF.js';
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - Scale of rectangle in inner
 * @param outer - Scale of rectangle in outer
 * @param slices - Scale of rectangle in slices
 * @param loops - Scale of rectangle in loops
 */
export class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	}
    
    
    initBuffers() {

		// Vertices, texCoords and normals
		this.vertices  = [];
		this.texCoords = [];
		this.normals   = [];

		this.innerCos = [];
        this.innerSin = [];
        this.outerCos = [];
        this.outerSin = [];

        for (let s = 0; s <= this.slices; ++s){
			let angle = 2.0*Math.PI*s/this.slices;

            this.innerCos.push(Math.cos(angle));
            this.innerSin.push(Math.sin(angle));
        }


        for (let l = 0; l <= this.loops; ++l){
			let angle = 2.0*Math.PI*l/this.loops;

            this.outerCos.push(Math.cos(angle));
            this.outerSin.push(Math.sin(angle));
        }
        

		for(let i = 0; i <= this.loops; ++i){
			let l = i/this.loops;


			for(let j = 0; j <= this.slices; ++j){

				let x = (this.inner*this.innerCos[j] + this.outer)*this.outerCos[i];
				let y = (this.inner*this.innerCos[j] + this.outer)*this.outerSin[i];
				let z = -this.inner*this.outerSin[j];
				
				this.vertices.push(x, y, z);


				let Nx = -this.innerCos[j]*( this.inner*this.innerCos[j]*this.outerCos[i] + this.outer*this.outerCos[i]);
				let Ny =  this.innerCos[j]*(-this.inner*this.innerCos[j]*this.outerSin[i] - this.outer*this.outerSin[i]);
				let Nz = -this.outerSin[i]*this.innerSin[j]*(-this.inner*this.outerSin[i]*this.innerCos[j] - this.outer*this.outerSin[i])
						 +this.outerCos[i]*this.innerSin[j]*( this.inner*this.outerCos[i]*this.innerCos[j] + this.outer*this.outerCos[i]);
				let Nr = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);

				this.normals.push(-Nx/Nr, -Ny/Nr, -Nz/Nr);

				let s = j/this.slices;
				this.texCoords.push(l, s);
			}
		}

		// Indices
		this.indices = [];

		for(let loop = 0; loop < this.loops; ++loop){
			let base1 = (this.slices+1) * loop;
			let base2 = (this.slices+1) * (loop+1);
			for(let i = base1, j = base1 + 1, k = base2, l = base2+1; j < base2; ++i, ++j, ++k, ++l){
				this.indices.push(i, l, k);
				this.indices.push(i, j, l);
			}
		}

		// Others		
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

