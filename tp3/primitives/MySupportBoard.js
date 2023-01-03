import {CGFobject, CGFtexture, CGFappearance} from '../../lib/CGF.js';
import { MyCube } from '../primitives/MyCube.js';
import { MyPatch } from './MyPatch.js';
/**
 * MyMainBoard
 * @constructor
 * @param scene   - Reference to MyScene object
 * 
 */
 export class MySupportBoard extends CGFobject {
    constructor(scene) {
		super(scene);
        this.scene = scene;
        // this.coords = [x, y, z];
        this.initBuffers();

        this.mat = new CGFappearance(this.scene);
        this.mat.setAmbient(0.05,0.05,0.05,1.0);
        this.mat.setDiffuse(0.3,0.3,0.3,1.0);
        this.mat.setSpecular(0.1,0.1,0.1,1.0);
        this.mat.setShininess(100.0);

        

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
            mat4.scale(matrix, matrix, [8.5, 1, 0.25])
            mat4.rotate(matrix, matrix, Math.PI*i, [0, 1, 0])
            mat4.translate(matrix, matrix, [0, -0.9, 4.5])
            
            this.scene.multMatrix(matrix)
            this.cube.display();
            this.scene.popMatrix();
        }
        for(var i = 0; i < 2; i++){
            this.scene.pushMatrix();
            let matrix = mat4.create()
            mat4.scale(matrix, matrix, [0.25, 1, 2])
            mat4.rotate(matrix, matrix, Math.PI*i + Math.PI/2, [0, 1, 0])
            mat4.translate(matrix, matrix, [0, -0.9, 16.5])
            
            this.scene.multMatrix(matrix)
            this.cube.display();
            this.scene.popMatrix();
        }
        this.mat.apply();

        this.scene.pushMatrix();
        let matrix = mat4.create()
        mat4.translate(matrix, matrix, [-4, 0, 1])
        mat4.rotate(matrix, matrix, -Math.PI/2, [1, 0, 0])
        mat4.scale(matrix, matrix, [8, 2, 3])
        this.scene.multMatrix(matrix)

        this.patch.display();
        this.scene.translate(0, 1, -0.3)
        this.scene.rotate(Math.PI, 1, 0, 0)
        this.patch.display();
        this.scene.popMatrix();

    }
}