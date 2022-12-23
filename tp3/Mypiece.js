import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyPiece extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.type = id;
        this.geometry = mat4.create();
        this.tile = [];
        this.coordinates
	}

    getType(){

    }

    setType(type){

    }

    display(){
    
    }
}