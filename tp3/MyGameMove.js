import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameMove extends CGFobject{
    constructor(scene, piece, origin, deest, prevmove) {
        super(scene)
        this.movedpiece = piece;
        this.origin = origin;
        this.dest = dest;
        this.statebef = prevmove
	}

    animate(){
    
    }
}