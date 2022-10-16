import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

/**
 *
 */
export class MyComponent extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.id = id;
        this.transformation = mat4.create();
        this.accumulative_transformation = mat4.create();
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

        //transformations
        //this.scene.multMatrix(this.transformation);

        this.scene.multMatrix(this.transformation);


        // if (father != null){
        //     //console.log(this.id)
        //     mat4.mul(this.accumulative_transformation, this.transformation, father.accumulative_transformation);
        // }
        // else{
        //     this.accumulative_transformation = this.transformation
        // }

        // this.scene.multMatrix(this.accumulative_transformation)


    }

    display(father){


        //console.log(matrix)

        let currentMaterial = new CGFappearance(this.scene)

        //materials
        if (this.materials[this.materialIndex] == "inherit"){
            this.materials[this.materialIndex] = father.materials[father.materialIndex]
        }

        //currentMaterial = this.materials[this.materialIndex]
        Object.assign(currentMaterial, this.materials[this.materialIndex])


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



        for(let i = 0; i < this.children.length; i++){

            this.setupMatrix(father);



            this.children[i].changeTexCoords(this.length_s, this.length_t);
            currentMaterial.apply();

            this.children[i].display(this);


            this.children[i].resetTexCoords(this.length_s, this.length_t);
            this.scene.popMatrix();

        }

    }
}