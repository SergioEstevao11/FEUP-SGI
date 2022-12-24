import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameSequence extends CGFobject{
    constructor(scene) {
        super(scene)
        this.sequence = [];
	}

    addMove(move){
        this.sequence.push(move)
    }

    undo(){
        this.sequence.pop()
    }

    moveReplay(coords){

    }
}