import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';
import { MyTile } from './MyTile.js';
import { MyPiece } from './MyPiece.js';
import { MyAuxilaryBoard } from './MyAuxilaryBoard.js';
import { MyPieceMoveAnim } from '../animations/MyPieceMoveAnim.js';
import { MyPieceCaptureAnim } from '../animations/MyPieceCaptureAnim.js';

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

        // this.gameboard[0][0].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[0][0], "white"));
        // this.gameboard[1][1].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[1][1], "black"));

        // this.gameboard[6][0].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[6][0], "white"));

        // this.gameboard[3][5].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[3][5], "black"));
        // this.gameboard[2][6].setPiece(new MyPiece(this.orchestrator,id++, "cylinder", this.gameboard[2][6], "white"));


    
        //mount secondary gameboards
        this.p1auxboard = new MyAuxilaryBoard(this.orchestrator, this, "white");
        this.p2auxboard = new MyAuxilaryBoard(this.orchestrator, this, "black");
        
	}

    getPieces(player){
        var pieces = [];
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                var tile = this.gameboard[i][j];
                if (tile.piece != null){
                    if ((player == 1) && (tile.piece.type == "white")){
                        pieces.push(tile.piece);
                    }
                    else if ((player == 2) && (tile.piece.type == "black")){
                        pieces.push(tile.piece);
                    }
                }
            }
        }
        return pieces;
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

    hasPiece(x,y){
        if (this.checkinbounds(x,y)){
            return (this.gameboard[y][x]).piece != null;
        }
        return false;
    }

    hasPieceInTile(tileId){
        var tile = this.getTile(tileId)
        if (tile.piece == null){
            return false;
        }
        return true;
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

        let positions = []
        positions.push(tile.coordinates);

        for (let i=0; i < path.length; i++){
            newtile = this.getTile(path[i]);
           

            if (newtile.piece != null){
                let tile_to_unset = [newtile];
                let auxboard = null
                if (tile_to_unset[0].piece.type == "white"){
                    auxboard = this.p1auxboard
                }else{
                    auxboard = this.p2auxboard
                }

                let num_pieces = auxboard.num_pieces
                let moving_piece = tile_to_unset[0].piece
                let piece_capture_animation = new MyPieceCaptureAnim(this.orchestrator, moving_piece, [newtile.coordinates, auxboard.board[num_pieces+Math.floor(i/2)].coordinates], Math.floor(i/2),
                    function(){let captured_piece = tile_to_unset[0].unsetPiece(); captured_piece.moveToAuxBoard(); })
                this.orchestrator.animator.addAnimation(piece_capture_animation);

                let cur_auxboard = [auxboard]

                this.orchestrator.currentMove.addAction(
                    function(){cur_auxboard[0].unsetPiece(); tile_to_unset[0].setPiece(moving_piece);})


                score++;
            }
            else{
                positions.push(newtile.coordinates);
            }


            if (i == path.length - 1){
                console.log("positions:", positions)
                let piece_move_animation = new MyPieceMoveAnim(this.orchestrator, piece, positions, 
                    function(){  tile.unsetPiece();newtile.setPiece(piece); })
                
                this.orchestrator.currentMove.addAction(
                    function(){newtile.unsetPiece(); tile.setPiece(piece); })
                
                this.orchestrator.animator.addAnimation(piece_move_animation);
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
        this.p1auxboard.display();
        this.p2auxboard.display();

        this.scene.popMatrix();
    }
}