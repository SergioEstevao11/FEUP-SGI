import {CGFobject} from '../../lib/CGF.js';
import { MyPatch } from '../primitives/MyPatch.js';
/**
 * Patch
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param npointsU - number of sections in U direction
 * @param npointsV - number of sections in V direction
 * @param controlVerts- control points for the patch
 * @param divU - num of division in U direction
 * @param divV - num of division in V direction
 * @param controlVerts - control vertices
 * 
 */
 export class MyCube extends CGFobject {
    constructor(scene) {
		super(scene);
        this.scene = scene
        this.initBuffers();
    }

    initBuffers() {
        this.patch = new MyPatch(this.scene, 1, 1, 20, 20, 
            [
                [
                    [0,0,0,1],
                    [0,1,0,1]
                ],
                [
                    [1,0,0,1],
                    [1,1,0,1]
                ]
            ])
    }

    changeTexCoords(length_s, length_t) {
        //dummy function
    }

    resetTexCoords() {
        //dummy function
    }

    display() {
        for(var i = 0; i < 4; i++){
            this.scene.pushMatrix();
            let matrix = mat4.create()
            mat4.rotate(matrix, matrix, Math.PI*i/2, [0, 1, 0])
            mat4.translate(matrix, matrix, [-0.5, 0, 0.5])
            this.scene.multMatrix(matrix)
            this.patch.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        let matrix = mat4.create()
        mat4.rotate(matrix, matrix, -Math.PI/2, [1,0, 0])
        mat4.translate(matrix, matrix, [-0.5, -0.5, 1])
        this.scene.multMatrix(matrix)
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        mat4.rotate(matrix, matrix, Math.PI, [1,0, 0])
        mat4.translate(matrix, matrix, [0, -1, 1])
        this.scene.multMatrix(matrix)
        this.patch.display();
        this.scene.popMatrix();
    }
}