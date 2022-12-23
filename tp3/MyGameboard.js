import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';
import { MyTile } from './MyTile.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameboard extends CGFobject{
    constructor(scene) {
        super(scene)
        this.gameboard = [];
        let line = [];
        let type = false;
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                line.push(new MyTile(type, x, y));
                type = !type;
            }
            this.gameboard.push(line);
            line = [];
            type = !type;
        }
	}

    addPiece(piece){

    }

    removePiece(){

    }

    getPiece(coords){

    }

    getTilePiece(piece_id){

    }

    getTile(coords){
        
    }

    movePiece(piece_id, start, end){
        
    }

    display(){
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                display(this.gameboard[i][j])
            }
        }
    }
}