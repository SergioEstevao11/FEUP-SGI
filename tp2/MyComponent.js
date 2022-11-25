import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyComponent extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.id = id;
        this.transformation = mat4.create();
        this.accumulative_transformation = mat4.create();
        this.materials = [];
        this.isMaterialInherit = [];
        this.materialIndex = 0;
        this.texture = null;
        this.animation = null
        this.children = [];
        this.highlighted = false;
        this.shaderValues = null;
	}

    addTransformation(matrix){
        mat4.copy(this.transformation, matrix);
    }

    addMaterial(newMaterial){
        this.materials.push(newMaterial);
        if(newMaterial == "inherit"){
            this.isMaterialInherit.push(true);
        }
        else{
            this.isMaterialInherit.push(false);
            
        }
    }

    setTexture(newTexture, length_s, length_t){
        this.texture = newTexture;
        this.length_s = length_s;
        this.length_t = length_t
    }

    setAnimation(animation){
        this.animation = animation;
    }

    setHighlighted(){
        this.highlighted = true;
    }

    setShaderValues(shaderValues){
        this.shaderValues = shaderValues;
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

        this.scene.multMatrix(this.transformation);


    }
    changeTexCoords(length_s, length_t){
        //dummy function
		return;

	}

	resetTexCoords(){
		//dummy function
		return;
	}

    /** Implements the components' transformations, material, and textures and displays its children
     * 
     * @param {*} father component's father
     */
    display(father){
        let currentMaterial = new CGFappearance(this.scene)

        //materials
        if (this.isMaterialInherit[this.materialIndex]){
            this.materials[this.materialIndex] = father.materials[father.materialIndex]
        }

        Object.assign(currentMaterial, this.materials[this.materialIndex])


        //textures
        if(this.texture == "inherit"){
            this.texture = father.texture;
            this.length_s = father.length_s;
            this.length_t = father.length_t;
            currentMaterial.setTexture(this.texture);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT'); //usar depois length_s e length_t do father
        }
        else if(this.texture != "none"){
            currentMaterial.setTexture(this.texture);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        }


        for(let i = 0; i < this.children.length; i++){

            if(this.highlighted && this.children[i].children == null){
                this.scene.shader.setUniformsValues(this.shaderValues);
                this.scene.setActiveShader(this.scene.shader);
            }

            this.setupMatrix(father);


            if (this.texture != "none"){
                // console.log("child: ", this.children[i])
                this.children[i].changeTexCoords(this.length_s, this.length_t);
            }
            currentMaterial.apply();

            if(this.animation == null){
                this.children[i].display(this);
            }else if(this.animation.currentKeyframe != -1){
                this.animation.apply();
                this.children[i].display(this);
            }


            if (this.texture != "none"){
                this.children[i].resetTexCoords(this.length_s, this.length_t);
            }
            this.scene.popMatrix();

            if(this.highlighted){
                this.scene.setActiveShader(this.scene.defaultShader);
            }

        }

       
    }
}