import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';

/**
 * Data Class that holds information about the component
 */
export class MyAuxilaryBoard extends CGFobject{
    constructor(orchestrator, gameboard) {
        super(orchestrator.getScene())
        this.orchestrator = orchestrator;
        this.gameboard = gameboard;
        this.board = [];
        this.num_pieces = 0;

        //mount tiles
        
        for (let x = 0; x < 8; x++){
            this.board.push(new MyTile(this.orchestrator, 200+x,this.gameboard, "aux", x, 0, 0));
        }
        for (let x = 0; x < 4; x++){
            this.board.push(new MyTile(this.orchestrator, 208+x, this.gameboard, "aux", x+0.5, 0, 0.25));
        }
        
        
        
	}

    getNextTile(){
        return this.board[this.num_pieces]
    }

    addPiece(piece){
        this.board[this.num_pieces].setPiece(piece);
        this.num_pieces++;
    }

    removePiece(){
        this.board[this.num_pieces].setPiece(null);
        this.num_pieces--;
    }

    getPiece(coords){

    }

    getTilePiece(piece_id){

    }

    getTile(coords){
        
    }

    display(){
        this.scene.pushMatrix();
        for (let i = 0; i < 12; i++){
            
            this.board[i].display()
        }
        this.scene.popMatrix();
    }
}