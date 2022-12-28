import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';

/**
 * Data Class that holds information about the component
 */
export class MyAuxilaryBoard extends CGFobject{
    constructor(scene, gameboard) {
        super(scene)
        this.gameboard = gameboard;
        this.board = [];
        let num_pieces = 0;

        //mount tiles
        
        for (let x = 0; x < 8; x++){
            this.board.push(new MyTile(this.scene, this.gameboard, -1, x, 0, 0));
        }
        for (let x = 0; x < 4; x++){
            this.board.push(new MyTile(this.scene, this.gameboard, -1, x+0.5, 0, 0.25));
        }

        for (let x = 0; x < 12; x++){
            this.board[x].setPiece(new MyPiece(this.scene, "cylinder", this.board[x], 1));
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
        this.scene.pushMatrix();
        for (let i = 0; i < 8; i++){
            this.board[i].display()
        }
        

        for (let i = 8; i < 12; i++){
            
            this.board[i].display()
        }
        this.scene.popMatrix();
    }
}