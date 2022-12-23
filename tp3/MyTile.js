import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyTile extends CGFobject{
    constructor(scene, id) {
        super(scene)
        this.id = id;
        this.gameboard = mat4.create();
        this.piece = mat4.create();
        this.set = [];
        this.coordinates
	}

    setPiece(piece){

    }

    unsetPiece(){

    }

    getPiece(){

    }

    getBoard(){

    }

    setBoard(){

    }

    display(){
    
    }
}