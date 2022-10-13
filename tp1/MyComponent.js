import {CGFappearance, CGFobject} from '../lib/CGF.js';

/**
 * 
 */
export class MyComponent extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.id = id;
        this.transformation = mat4.create();
        this.materials = [];
        this.materialIndex = -1;
        this.texture = null;
        this.children = [];

	}

    addTransformation(matrix){
        mat4.copy(this.transformation, matrix);
    }

    addMaterial(newMaterial){
        this.materials.push(newMaterial);
        this.materialIndex += 1;
    }

    setTexture(newTexture, length_s, length_t){
        this.texture = newTexture;
        this.length_s = length_s;
        this.length_t = length_t
    }

    addChild(child){
        this.children.push(child);
    }

    incrementMaterialIndex(){
        this.materialIndex+=1;
        this.materialIndex %= this.materials.length;
    }

    setupMatrix(father){
        this.scene.pushMatrix();

        //this.scene.multMatrix(matrix)

        let currentMaterial = null;

        //transformations
        if (father != null){
            this.scene.multMatrix(father.transformation);
        }

        this.scene.multMatrix(this.transformation);
    }

    display(father){


        //console.log(matrix)

        this.setupMatrix(father);

        var currentMaterial = null

        //materials
        if (this.materials[this.materialIndex] == "inherit"){
            this.materials[this.materialIndex] = father.materials[father.materialIndex]
        }
        
        currentMaterial = this.materials[this.materialIndex]
        

        //textures
        if(this.texture == "inherit"){
            console.log("father texture: ", father.texture);
            this.texture = father.texture
            currentMaterial.setTexture(this.texture);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT'); //usar depois length_s e length_t do father
        }
        else if(this.texture != "none"){
            currentMaterial.setTexture(this.texture);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        }

        let matrix = this.scene.matrix
  
        for(let i = 0; i < this.children.length; i++){

            currentMaterial.apply();
            
            this.children[i].display(this);
            this.scene.popMatrix();
            
            this.setupMatrix(father);
        }

        this.scene.popMatrix();

    }
}