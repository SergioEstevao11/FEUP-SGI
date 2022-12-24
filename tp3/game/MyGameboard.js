import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameboard extends CGFobject{
    constructor(scene) {
        super(scene)
        this.gameboard = [];
        let line = [];
        let type = false; // true = white, false = black

        //mount tiles
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                line.push(new MyTile(this.scene, this, type, x, y));
                type = !type;
            }
            this.gameboard.push(line);
            line = [];
            type = !type;
        }

        //mount pieces

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
                this.gameboard[i][j].display();
            }
        }
    }
}