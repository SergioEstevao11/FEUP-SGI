import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyCylinder } from '../primitives/MyCylinder.js';
import { MySphere } from '../primitives/MySphere.js';

/**
 * Data Class that holds information about the component
 */
export class MyPiece extends CGFobject{
    constructor(scene, geometry, tile, type) {
        super(scene)
        this.type = type;
        this.geometry = geometry;
        this.tile = tile;

        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0.01,0.01,0.01,1.0);
        this.black_material.setDiffuse(0.05,0.05,0.05,1.0);
        this.black_material.setSpecular(0.1,0.1,0.1,1.0);
        this.black_material.setShininess(100.0);

        this.white_material = new CGFappearance(this.scene);
        this.white_material.setAmbient(0.01,0.01,0.01,1.0);
        this.white_material.setDiffuse(0.7,0.7,0.7,1.0);
        this.white_material.setSpecular(0.1,0.1,0.1,1.0);
        this.white_material.setShininess(100.0);

        this.cylinder = new MyCylinder(this.scene, 0.4, 0.4, 0.25, 20, 20);
        this.cover1 = new MySphere(this.scene, 0.4, 20, 20);
        this.cover2 = new MySphere(this.scene, 0.4, 20, 20);
	}

    getType(){
        return this.type;
    }

    setType(type){
        this.type = type;
    }

    display(){

        // Display tile itself
        if (this.type == "white")
            this.white_material.apply();
        else
            this.black_material.apply();

        this.scene.translate(0.5, 0.5, 0);
        this.cylinder.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.25);
        this.scene.scale(1, 1, 0.01);
        this.cover1.display();
        
        this.scene.pushMatrix()
        this.scene.translate(0, 0, -0.5);
        this.cover2.display();
        this.scene.popMatrix();
        this.scene.popMatrix();

        
    }
}