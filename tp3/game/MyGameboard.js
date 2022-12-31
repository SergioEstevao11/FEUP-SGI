import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';
import { MyAuxilaryBoard } from './MyAuxilaryBoard.js';
import { MyPieceMoveAnim } from '../animations/MyPieceMoveAnim.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameboard extends CGFobject{
    constructor(orchestrator) {
        super(orchestrator.getScene());
        this.orchestrator = orchestrator;
        this.gameboard = [];
        let line = [];
        let type = "black"; // true = white, false = black

        //mount tiles
        let id = 0;
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                line.push(new MyTile(this.orchestrator, id++, this, type, x, y, 0));
                type = this.changeColor(type);
                // line.push(new MyTile(this.scene, this, type, x, y, 0));
                // type = !type;
            }
            this.gameboard.push(line);
            line = [];
            type = this.changeColor(type);
        }

        //mount pieces
        for (let i = 0; i < 4; i++){
            this.gameboard[0][i*2].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[0][i*2], "white"));
            this.gameboard[1][i*2+1].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[1][i*2+1], "white"));
            this.gameboard[2][i*2].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[2][i*2], "white"));

            this.gameboard[5][i*2+1].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[5][i*2+1], "black"));
            this.gameboard[6][i*2].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[6][i*2], "black"));
            this.gameboard[7][i*2+1].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[7][i*2+1], "black"));
        }

        //mount secondary gameboards
        this.p1auxboard = new MyAuxilaryBoard(this.orchestrator, this);
        this.p2auxboard = new MyAuxilaryBoard(this.orchestrator, this);
        
	}


    checkinbounds(x,y){
        if ((x<0) || (x>7) || (y<0) || (y>7)){
            return false;
        }
        return true;
    }

    changeColor(type){
        if (type == "white"){
            return "black";
        }
        else if (type == "black"){
            return "white";
        }
    }

    // addPiece(piece){

    // }

    removePieceFromTile(id){
        var tile = this.getTile(id);
        if (tile.piece != null){
            tile.piece = null;
        }
    }

    getTileC(x,y){
        if (!this.checkinbounds(x,y)){
            return null;
        }
        return this.gameboard[y][x];
    }

    getPieceC(x,y){
        if (!this.checkinbounds(x,y)){
            return null;
        }
        if (this.hasPiece(x,y)){
            return (this.gameboard[y][x]).piece;
        }
        return null;
    }

    getTypePiece(x,y){
        if (this.hasPiece(x,y)){
            return (this.gameboard[y][x]).piece;
        }
        return null;
    }

    // getTilePiece(piece_id){

    // }

    // getTile(coords){
        
    // }

    hasPiece(x,y){
        if (this.checkinbounds(x,y)){
            return (this.gameboard[y][x]).piece != null;
        }
        return false;
    }

    getTile(id){
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.gameboard[i][j].id == id){
                    return this.gameboard[i][j];
                }
            }
        }
    }

    getPiece(id){
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.gameboard[i][j].piece != null){
                    if (this.gameboard[i][j].piece.id == id)
                    return this.gameboard[i][j].piece;
                }
            }
        }
    }

    movePiece(tile, path){
        let newtile;
        let score = 0;
        let piece = tile.piece;
        let captured_piece = null;

        let positions = []

        for (let i=0; i < path.length; i++){
            newtile = this.getTile(path[i]);
           
            positions.push(newtile.coordinates);

            if (newtile.piece != null){
                captured_piece = newtile.unsetPiece();
                //captured_piece animations
                captured_piece.moveToAuxBoard();
                score++;
            }


            if (i == path.length - 1){
                let piece_move_animation = new MyPieceMoveAnim(this.orchestrator, piece, positions, 
                    function(){  tile.unsetPiece();newtile.setPiece(piece); })
                
                this.orchestrator.animator.addAnimation(piece_move_animation);
                // tile.unsetPiece();
                // newtile.setPiece(piece);
            }
            

            
        }


        return score;
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