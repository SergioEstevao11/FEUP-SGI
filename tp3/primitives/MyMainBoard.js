import {CGFobject} from '../../lib/CGF.js';
import { MyCube } from '../primitives/MyCube.js';
import { MyPatch } from './MyPatch.js';
/**
 * MyMainBoard
 * @constructor
 * @param scene   - Reference to MyScene object
 * 
 */
 export class MyMainBoard extends CGFobject {
    constructor(scene) {
		super(scene);
        this.scene = scene;
        // this.coords = [x, y, z];
        this.initBuffers();
    }

    initBuffers() {
        this.cube = new MyCube(this.scene)
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
        for(var i = 0; i < 2; i++){
            this.scene.pushMatrix();
            let matrix = mat4.create()
            mat4.scale(matrix, matrix, [10, 1, 1])
            mat4.rotate(matrix, matrix, Math.PI*i, [0, 1, 0])
            mat4.translate(matrix, matrix, [0, -1, 4.5])
            
            this.scene.multMatrix(matrix)
            this.cube.display();
            this.scene.popMatrix();
        }
        for(var i = 0; i < 2; i++){
            this.scene.pushMatrix();
            let matrix = mat4.create()
            mat4.scale(matrix, matrix, [1, 1, 8])
            mat4.rotate(matrix, matrix, Math.PI*i + Math.PI/2, [0, 1, 0])
            mat4.translate(matrix, matrix, [0, -1, 4.5])
            
            this.scene.multMatrix(matrix)
            this.cube.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        let matrix = mat4.create()
        mat4.translate(matrix, matrix, [-4, -1, -4])
        mat4.rotate(matrix, matrix, Math.PI/2, [1, 0, 0])
        mat4.scale(matrix, matrix, [8, 8, 1])
        this.scene.multMatrix(matrix)
        this.patch.display();
        this.scene.popMatrix();

    }
}