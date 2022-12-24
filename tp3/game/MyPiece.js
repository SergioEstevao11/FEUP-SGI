import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyPiece extends CGFobject{
    constructor(scene, type, tile) {
        super(scene)
        this.type = type;
        //this.geometry = mat4.create();
        this.tile = tile;
	}

    getType(){
        return this.type;
    }

    setType(type){
        this.type = type;
    }

    display(){
        //TODO
    }
}