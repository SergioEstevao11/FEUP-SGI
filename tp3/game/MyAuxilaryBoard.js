import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';

/**
 * Data Class that holds information about the component
 */
export class MyAuxilaryBoard extends CGFobject{
    constructor(orchestrator, gameboard, type) {
        super(orchestrator.getScene())
        this.orchestrator = orchestrator;
        this.gameboard = gameboard;
        this.board = [];
        this.num_pieces = 0;

        //mount tiles
        if (type=="black"){
            for (let x = 0; x < 8; x++){
                this.board.push(new MyTile(this.orchestrator, 300+x,this.gameboard, "aux", x, -3, 0));
            }
            for (let x = 0; x < 4; x++){
                this.board.push(new MyTile(this.orchestrator, 308+x, this.gameboard, "aux", x+0.5, -3, 0.25));
            }
        }
        else{
            for (let x = 0; x < 8; x++){
                this.board.push(new MyTile(this.orchestrator, 300+x,this.gameboard, "aux", x, 3+7, 0));
            }
            for (let x = 0; x < 4; x++){
                this.board.push(new MyTile(this.orchestrator, 308+x, this.gameboard, "aux", x+0.5, 3+7, 0.25));
            }
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
        this.num_pieces--;
        this.board[this.num_pieces].piece.captured = false;
        this.board[this.num_pieces].unsetPiece();

    }

    display(){
        this.scene.pushMatrix();
        for (let i = 0; i < 12; i++){
            
            this.board[i].display()
        }
        this.scene.popMatrix();
    }
}