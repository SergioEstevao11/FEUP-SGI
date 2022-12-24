import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameMove extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.movedpiece = id;
        this.origin = mat4.create();
        this.dest = [];
        this.statebef
	}

    animate(){
    
    }
}