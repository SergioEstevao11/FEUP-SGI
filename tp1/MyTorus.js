import { CGFobject } from '../lib/CGF.js';
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
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        // Vertices and normals
        const angle = 2*Math.PI;
        
        this.innerCos = [];
        this.innerSin = [];
        this.outerCos = [];
        this.outerSin = [];
        for (let ia = 0; ia <= angle; ia+= angle/this.slices){
            this.innerCos.push(Math.cos(ia));
            this.innerSin.push(Math.sin(ia));
        }


        for (let oa = 0; oa <= angle; oa += angle/this.loops){
            this.outerCos.push(Math.cos(oa));
            this.outerSin.push(Math.sin(oa));
        }

        console.log(this.outerSin)

        for(var l = 0; l <= this.loops; l++){
            for (var i = 0; i <= this.slices; i++) {
                let x = (this.outer + this.inner*this.innerCos[i])*this.outerCos[l];
                let y = (this.outer + this.inner*this.innerCos[i])*this.outerSin[l];
                let z = this.inner*this.innerSin[i];
                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                //this.texCoords.push(i/this.slices, 1);
                //this.vertices.push(x, this.height, z);
                //this.normals.push(x, 0, z);
                //this.texCoords.push(i/this.slices, 0);
            }
        }
        //Triangles
        
        for(let l = 0; l <= this.loops; l++){
            for(let i = 0; i <= this.slices; i++){
                let index = i + l*this.slices;
                this.indices.push(index, index+this.slices, index+1);
                this.indices.push(index+this.slices, index+this.slices+1, index+1);        
            }
        }
        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	/*
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
	*/
}

