import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';
import { MyAuxilaryBoard } from './MyAuxilaryBoard.js';

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
                line.push(new MyTile(this.scene, this, type, x, y, 0));
                type = !type;
            }
            this.gameboard.push(line);
            line = [];
            type = !type;
        }

        //mount pieces
        for (let i = 0; i < 4; i++){
            this.gameboard[0][i*2].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[0][i*2], "white"));
            this.gameboard[1][i*2+1].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[1][i*2+1], "white"));
            this.gameboard[2][i*2].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[2][i*2], "white"));

            this.gameboard[5][i*2+1].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[5][i*2+1], "black"));
            this.gameboard[6][i*2].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[6][i*2], "black"));
            this.gameboard[7][i*2+1].setPiece(new MyPiece(this.scene, "cylinder", this.gameboard[7][i*2+1], "black"));
        }

        //mount secondary gameboards
        this.p1auxboard = new MyAuxilaryBoard(this.scene, this);
        this.p2auxboard = new MyAuxilaryBoard(this.scene, this);
        
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
        this.scene.translate(-4, 0, 4);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                this.gameboard[i][j].display();
            }
        }
        this.scene.translate(0,-3, 0);
        this.p1auxboard.display();

        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(-8, -14, 0);

        this.p2auxboard.display();

        this.scene.popMatrix();
    }
}