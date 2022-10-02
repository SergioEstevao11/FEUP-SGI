import {CGFobject} from '../lib/CGF.js';

/**
 * 
 */
export class MyComponent extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.id = id;
        this.transformation = mat4.create();
        this.material = null;
        this.texture = null;
        this.children = [];

	}

    addTransformation(matrix){
        mat4.copy(this.transformation, matrix);
    }

    setMaterial(newMaterial){
        this.material = newMaterial;
    }

    setTexture(newTexture){
        this.texture = newTexture;
    }

    addChild(child){
        this.children.push(child);
    }

    display(){
        
        this.scene.pushMatrix();
        
        this.scene.multMatrix(this.transformation);

        //console.log(this.children)

        for(let i = 0; i < this.children.length; i++){
            this.children[i].display();
        }

        this.scene.popMatrix();

    }
}