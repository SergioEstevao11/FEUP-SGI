import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader, CGFplane } from "../lib/CGF.js";

import { MyGameSequence } from './game/MyGameSequence.js';
import { MyGameboard } from './game/MyGameboard.js';
import { MyPiece } from './game/MyPiece.js';
import { MyTile } from './game/MyTile.js';
import { MySceneGraph } from './MySceneGraph.js';
import { MyAnimator } from "./game/MyAnimator.js";


const GameState = {
    menu: "MENU",
    load:  "LOAD",
    piece: "PIECE",
    render: "RENDER",
    dest: "DESTINATION",
    anim: "ANIMATION",
    eval: "EVALUATION",
    end: "END"
}

const rec_limit = 5;

/**
* MyScene
* @constructor
*/
export class MyGameOrchestrator{
    constructor(scene, filename) {
		this.scene = scene;
		this.scene.gameOrchestrator = this;
        this.gameboard = new MyGameboard(this);
		this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this.scene, this, this.gameSequence);
        this.graph = new MySceneGraph(this.scene, filename);
        
        this.play = true;
        this.scorep1 = 0;
        this.scorep2 = 0;
        this.gamestate = GameState.piece;
        this.dametime = false;

        this.avlplays = {};
        this.selectedpiece = null;
        this.rec_counter = 0;
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if (results != null && results.length > 0) { // any results?
                for (var i=0; i< results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = results[i][1] // get id
						console.log("Picked object: " + obj + ", with pick id " + uniqueId);
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if(obj instanceof MyPiece){
            obj = this.gameboard.getPiece(id);
            console.log("coordinates:");
            console.log(obj.tile.coordinates);

            // do something with id knowing it is a piece
            if (this.gamestate == GameState.piece || this.gamestate == GameState.dest){
                 if ((this.play && (obj.type == "white")) || (!this.play && (obj.type == "black"))){
                    this.selectedpiece = obj;
                    this.gamestate = GameState.render;
                    let x = obj.getCoords()[0];
                    let y = obj.getCoords()[1];
                    this.rec_counter=0;
                    this.avlplays = this.getAvlPlays(x, y, obj.type, [], false, obj.isDame());
                    if (obj.isDame()){
                        this.dametime = true;
                    }
                    console.log(obj.avlpsize)
                    console.log("avl plays");
                    console.log(this.avlplays);
                    this.gamestate = GameState.dest;

                    if(this.play){
                        console.log("Player one, choose destination tile");
                    }
                    else{
                        console.log("Player two, choose destination tile");
                    }
                 }
                 else {
                    console.log("Wrong play/move")
                 }
            }
        }
        else
        if(obj instanceof MyTile){
            obj = this.gameboard.getTile(id);
            // do something with id knowing it is a tile
            console.log(obj.coordinates);

            if (this.gamestate == GameState.dest){

                var score = this.gameboard.movePiece(this.selectedpiece.tile, this.avlplays[id]);

                if (this.checkIn(id,Object.keys(this.avlplays))) {
                    if(this.selectedpiece.isDame()){
                        this.gamestate = GameState.render;
                        let x = this.selectedpiece.getCoords()[0];
                        let y = this.selectedpiece.getCoords()[1];
                        this.avlplays = this.getAvlPlays(x, y, this.selectedpiece.type, [], false, true);
                        console.log("avl plays");
                        console.log(this.avlplays);
                        this.gamestate = GameState.dest;
                        if(Object.keys(this.avlplays).length == 0){
                            this.dametime=false;
                        }
                    }
                    if (!this.dametime){
                        if(((this.selectedpiece.getCoords()[1] == 0) || (this.selectedpiece.getCoords()[1] == 7)) && !this.selectedpiece.isDame()){
                            this.selectedpiece.setDame(true);
                        }

                        this.gamestate = GameState.eval;
                        if (this.play){
                            this.scorep1+=score;
                        }
                        else {
                            this.scorep2+=score;
                        }

                        var gameover = this.gameOver();
                        if (gameover == 1){
                            console.log("Player 1 won!");
                            this.gamestate = GameState.end;
                        }
                        else if (gameover == 2){
                            console.log("Player 2 won!");
                            this.gamestate = GameState.end;
                        }
                        else{
                            console.log("p1: " + this.scorep1);
                            console.log("p2: " + this.scorep2);

                            this.play = !this.play;
                            // this.setSelectablePieces();
                            console.log("avl pieces:")
                            if(this.play){
                                console.log(this.getSelectablePieces(1));
                            }
                            else{
                                console.log(this.getSelectablePieces(2));
                            }

                            this.gamestate = GameState.piece;
                            if(this.play){
                                console.log("Player one, choose piece");
                            }
                            else{
                                console.log("Player two, choose piece");
                            }
                        }
                    }
                }
                else {
                   console.log("Wrong play/move")
                }
            }
        }
        else {
            console.log("Wrong play/move")
        }
    }

    checkinbounds(x,y){
        if ((x<0) || (x>7) || (y<0) || (y>7)){
            return false;
        }
        return true;
    }

    checkIn(val,arr){
        for (let i=0; i<arr.length; i++){
            if(val == arr[i]){
                return true;
            }
        }
        return false;
    }

    //return dict {id_tile -> [path from x,y to tile]}
    getAvlPlays(x,y, color, oldpath, captured, isdame){
        var avlplays = {};
        var nextplays = {};
        var plays = {};
        var path;
        if (!isdame){
            if (color == "white"){  
                if (this.gameboard.hasPiece(x+1,y+1)){   
                    if ((this.gameboard.getPieceC(x+1,y+1).type == "black") && 
                        !this.gameboard.hasPiece(x+2, y+2) &&
                        this.checkinbounds(x+2,y+2)){
                        path = [...oldpath];
                        path.push(this.gameboard.getTileC(x+1,y+1).id);
                        path.push(this.gameboard.getTileC(x+2,y+2).id);
                        avlplays[this.gameboard.getTileC(x+2,y+2).id] = path;
                        nextplays = this.getAvlPlays(x+2,y+2,color, path, true, isdame);
                        plays = Object.assign({},avlplays,nextplays);
                    }
                }
                else if (this.checkinbounds(x+1,y+1) && !captured){
                    path = [...oldpath];
                    path.push(this.gameboard.getTileC(x+1,y+1).id);
                    plays[this.gameboard.getTileC(x+1,y+1).id] = path;
                }

                if (this.gameboard.hasPiece(x-1,y+1)){
                    if ((this.gameboard.getPieceC(x-1,y+1).type == "black") && 
                        !this.gameboard.hasPiece(x-2, y+2) &&
                        this.checkinbounds(x-2,y+2)){
                        path = [...oldpath];
                        path.push(this.gameboard.getTileC(x-1,y+1).id);
                        path.push(this.gameboard.getTileC(x-2,y+2).id);
                        avlplays[this.gameboard.getTileC(x-2,y+2).id] = path;
                        nextplays = this.getAvlPlays(x-2,y+2,color,path,true, isdame);
                        plays = Object.assign({},avlplays,nextplays);
                    }
                }
                else if (this.checkinbounds(x-1,y+1) && !captured){
                    path = [...oldpath];
                    path.push(this.gameboard.getTileC(x-1,y+1).id);
                    plays[this.gameboard.getTileC(x-1,y+1).id] = path;
                }
            }
            if (color == "black"){    
                if (this.gameboard.hasPiece(x+1,y-1)){
                    if ((this.gameboard.getPieceC(x+1,y-1).type == "white") && 
                        !this.gameboard.hasPiece(x+2, y-2) &&
                        this.checkinbounds(x+2,y-2)){
                        path = [...oldpath];
                        path.push(this.gameboard.getTileC(x+1,y-1).id);
                        path.push(this.gameboard.getTileC(x+2,y-2).id);
                        avlplays[this.gameboard.getTileC(x+2,y-2).id] = path;
                        nextplays = this.getAvlPlays(x+2,y-2,color,path,true, isdame);
                        plays = Object.assign({},avlplays,nextplays);
                    }
                }
                else if (this.checkinbounds(x+1,y-1) && !captured){
                    path = [...oldpath];
                    path.push(this.gameboard.getTileC(x+1,y-1).id);
                    plays[this.gameboard.getTileC(x+1,y-1).id] = path;
                }
                if (this.gameboard.hasPiece(x-1,y-1)){
                    if ((this.gameboard.getPieceC(x-1,y-1).type == "white") && 
                        !this.gameboard.hasPiece(x-2, y-2) &&
                        this.checkinbounds(x-2,y-2)){
                        path = [...oldpath];
                        path.push(this.gameboard.getTileC(x-1,y-1).id);
                        path.push(this.gameboard.getTileC(x-2,y-2).id);
                        avlplays[this.gameboard.getTileC(x-2,y-2).id] = path;
                        nextplays = this.getAvlPlays(x-2,y-2,color,path,true,isdame);
                        plays = Object.assign({},avlplays,nextplays);
                    }
                }
                else if (this.checkinbounds(x-1,y-1) && !captured){
                    path = [...oldpath];
                    path.push(this.gameboard.getTileC(x-1,y-1).id);
                    plays[this.gameboard.getTileC(x-1,y-1).id] = path;
                }
            }
        }
        else{
            var blockedright = false;
            var blockedleft = false;
            var blockedbackright = false;
            var blockedbackleft = false;
            for (let i=1; i<8; i++){
                if (this.gameboard.hasPiece(x+i,y+i)){
                    if (!this.gameboard.hasPiece(x+i+1,y+i+1) &&
                    this.gameboard.getPieceC(x+i,y+i).type != color &&
                    !blockedright){
                        path = [];
                        for (let j=1; j<=i+1; j++){
                            path.push(this.gameboard.getTileC(x+j,y+j).id);
                        }
                        plays[this.gameboard.getTileC(x+i+1,y+i+1).id] = path;
                        blockedright = true;
                    }
                    else if (this.gameboard.hasPiece(x+i,y+i) &&
                    this.gameboard.hasPiece(x+i+1,y+i+1)){
                        blockedright = true;
                    }
                }
                if (this.gameboard.hasPiece(x-i,y+i)){
                    if (!this.gameboard.hasPiece(x-i-1,y+i+1) &&
                    this.gameboard.getPieceC(x-i,y+i).type != color &&
                    !blockedleft){
                        path = [];
                        for (let j=1; j<=i+1; j++){
                            path.push(this.gameboard.getTileC(x-j,y+j).id);
                        }
                        plays[this.gameboard.getTileC(x-i-1,y+i+1).id] = path;
                        blockedleft = true;
                    }
                    else if (this.gameboard.hasPiece(x-i,y+i) &&
                    this.gameboard.hasPiece(x-i-1,y+i+1)){
                    blockedleft = true;
                    }
                }
                if (this.gameboard.hasPiece(x+i,y-i)){
                    if (!this.gameboard.hasPiece(x+i+1,y-i-1) &&
                    this.gameboard.getPieceC(x+i,y-i).type != color &&
                    !blockedbackright){
                        path = [];
                        for (let j=1; j<=i+1; j++){
                            path.push(this.gameboard.getTileC(x+j,y-j).id);
                        }
                        plays[this.gameboard.getTileC(x+i+1,y-i-1).id] = path;
                        blockedbackright = true;
                    }
                    else if (this.gameboard.hasPiece(x+i,y-i) &&
                    this.gameboard.hasPiece(x+i+1,y-i-1)){
                    blockedbackright = true;
                    }
                }
                if (this.gameboard.hasPiece(x-i,y-i)){
                    if (!this.gameboard.hasPiece(x-i-1,y-i-1) &&
                    this.gameboard.getPieceC(x-i,y-i).type != color &&
                    !blockedbackleft){
                        path = [];
                        for (let j=1; j<=i+1; j++){
                            path.push(this.gameboard.getTileC(x-j,y-j).id);
                        }
                        plays[this.gameboard.getTileC(x-i-1,y-i-1).id] = path;
                        blockedbackleft = true;
                    }
                    else if (this.gameboard.hasPiece(x-i,y-i) &&
                    this.gameboard.hasPiece(x-i-1,y-i-1)){
                    blockedbackleft = true;
                    }
                }
            }
            //1st - check avl captures in all directions
            //2nd - generate paths for each of the directions that contain captures
            //3rd - use recursivity to generate new paths from the adjacent
            //4th - verify if pieces to capture arent already present in the path
            //5th - select only one of the results that end in the same position 
            // var blockedright = false;
            // var blockedleft = false;
            // var blockedbackright = false;
            // var blockedbackleft = false;
            // path = [...oldpath];
            // for (let i=1; i<8; i++){
            //     if (!blockedright && this.checkinbounds(x+i,y+i)){
            //         if (this.gameboard.hasPiece(x+i,y+i)){
            //             if ((this.gameboard.getPieceC(x+i,y+i).type == color) || 
            //             ((this.gameboard.getPieceC(x+i,y+i).type != color) &&
            //             this.gameboard.hasPiece(x+i+1,y+i+1))){
            //                 blockedright = true;
            //             }
            //             else if (this.gameboard.getPieceC(x+i,y+i).type != color &&
            //             !this.gameboard.hasPiece(x+i+1,y+i+1) &&
            //             this.checkinbounds(x+i+1,y+i+1) && 
            //             !this.checkIn(this.gameboard.getPieceC(x+i,y+i).id,oldpath)
            //             ){
            //                 blockedright = true;
            //                 path = [...oldpath];
            //                 path.push(this.gameboard.getTileC(x+i,y+i).id);
            //                 path.push(this.gameboard.getTileC(x+i+1,y+i+1).id);
            //                 console.log("add to path1")
            //                 console.log(path);
            //                 avlplays[this.gameboard.getTileC(x+i+1,y+i+1).id] = [...path] ;
            //                 console.log("rec call1")
            //                 console.log(x+i+1,y+i+1,color,path,true,isdame)
            //                 nextplays = this.getAvlPlays(x+i+1,y+i+1,color,[...path],true,isdame);
            //                 plays = Object.assign({},avlplays,nextplays);
            //                 // if (!this.checkbrcaptures(x+i))
            //             }
            //         }
            //         else if (!captured){
            //             path.push(this.gameboard.getTileC(x+i,y+i).id);
            //             console.log("add to path1")
            //             console.log(path);
            //             avlplays[this.gameboard.getTileC(x+i,y+i).id] = [...path];
            //         }
            //         else{
            //             oldpath.push(this.gameboard.getTileC(x+i,y+i).id);
            //             console.log("add to path12")
            //             console.log(oldpath);
            //         }
            //     }   
            //     if (!blockedleft && this.checkinbounds(x-i,y+i)){
            //         if (this.gameboard.hasPiece(x-i,y+i)){
            //             if ((this.gameboard.getPieceC(x-i,y+i).type == color) || 
            //             ((this.gameboard.getPieceC(x-i,y+i).type != color) &&
            //             this.gameboard.hasPiece(x-i-1,y+i+1))){
            //                 blockedleft = true;
            //             }
            //             else if (this.gameboard.getPieceC(x-i,y+i).type != color &&
            //             !this.gameboard.hasPiece(x-i-1,y+i+1) &&
            //             this.checkinbounds(x-i-1,y+i+1) && 
            //             !this.checkIn(this.gameboard.getPieceC(x-i,y+i).id,oldpath)
            //             ){
            //                 blockedleft = true;
            //                 path = [...oldpath];
            //                 path.push(this.gameboard.getTileC(x-i,y+i).id);
            //                 path.push(this.gameboard.getTileC(x-i-1,y+i+1).id);
            //                 console.log("add to path21")
            //                 console.log(path);
            //                 avlplays[this.gameboard.getTileC(x-i-1,y+i+1).id] = [...path] ;
            //                 console.log("rec call2")
            //                 console.log(x-i-1,y+i+1,color,path,true,isdame)
            //                 nextplays = this.getAvlPlays(x-i-1,y+i+1,color,[...path],true,isdame);
            //                 plays = Object.assign({},avlplays,nextplays);
            //             }
            //         }
            //         else if (!captured){
            //             path.push(this.gameboard.getTileC(x-i,y+i).id);
            //             avlplays[this.gameboard.getTileC(x-i,y+i).id] = [...path];
            //         }
            //         else{
            //             oldpath.push(this.gameboard.getTileC(x-i,y+i).id);
            //             console.log("add to path22")
            //             console.log(oldpath);
            //         }
            //     }
            //     if (!blockedbackright && this.checkinbounds(x+i,y-i)){
            //         if (this.gameboard.hasPiece(x+i,y-i)){
            //             if ((this.gameboard.getPieceC(x+i,y-i).type == color) || 
            //             ((this.gameboard.getPieceC(x+i,y-i).type != color) &&
            //             this.gameboard.hasPiece(x+i+1,y-i-1))){
            //                 blockedbackright = true;
            //             }
            //             else if (this.gameboard.getPieceC(x+i,y-i).type != color &&
            //             !this.gameboard.hasPiece(x+i+1,y-i-1) &&
            //             this.checkinbounds(x+i+1,y-i-1) && 
            //             !this.checkIn(this.gameboard.getPieceC(x+i,y-i).id,oldpath)
            //             ){
            //                 blockedbackright = true;
            //                 path = [...oldpath];
            //                 path.push(this.gameboard.getTileC(x+i,y-i).id);
            //                 path.push(this.gameboard.getTileC(x+i+1,y-i-1).id);
            //                 console.log("add to path31")
            //                 console.log(path);
            //                 avlplays[this.gameboard.getTileC(x+i+1,y-i-1).id] = [...path] ;
            //                 console.log("rec call3")
            //                 console.log(x+i+1,y-i-1,color,path,true,isdame)
            //                 nextplays = this.getAvlPlays(x+i+1,y-i-1,color,[...path],true,isdame);
            //                 plays = Object.assign({},avlplays,nextplays);
            //             }
            //         }
            //         else if (!captured){
            //             path.push(this.gameboard.getTileC(x+i,y-i).id);
            //             avlplays[this.gameboard.getTileC(x+i,y-i).id] = [...path];
            //         }
            //         else{
            //             oldpath.push(this.gameboard.getTileC(x+i,y-i).id);
            //             console.log("add to path32")
            //             console.log(oldpath);
            //         }
            //     }                                                   
            //}
        }
        return plays;
    }

    checkbrcaptures(x,y,color){
        for (let i=0;i<8;i++){
            if (this.gameboard.hasPiece(x+i,y-i) &&
            !this.gameboard.hasPiece(x+i+1,y-i-1) &&
            this.gameboard.getPieceC(x+i,y-i).type != color){
                return true;
            }
        }
        return false;
    }


    filterAvlPlays(){
        var plays = {};
        var hascapture = false;
        for (var key in this.avlplays){
            var play = this.avlplays[key];
            for (let i=0; i<play.length; i++){
                if (this.gameboard.hasPieceId(i)){
                    plays[key] = play;
                    hascapture = true;
                }
            }
        }
        if (!hascapture){
            plays = this.avlplays
        }
        return plays;
    }

    setSelectablePieces(){
        //quando 2 peças podem comer uma, só uma delas é selecionada por alguma razao   
        //sometimes puts all as null
        var pieces;
        var color;
        var arrcapture = false;

        if (this.play){
            pieces  = this.gameboard.getPieces(1);
            color = "white";
        }
        else{
            pieces = this.gameboard.getPieces(2);
            color = "black";
        }

        for (let i=0; i<pieces.length; i++){
            var piece = pieces[i];
            
            var avlplays = this.getAvlPlays(piece.getCoords()[0], piece.getCoords()[1],color,[],false,piece.isDame());
            piece.avlpsize = Object.keys(avlplays).length;

            var hascapture = false;
            for (var key in avlplays){
                var play = avlplays[key];
                for (let j=0; j<play.length; j++){
                    var tile = this.gameboard.getTile(play[j]);
                    if ((tile.piece != null) && (tile.piece.type != color)){
                        hascapture = true;
                        arrcapture = true;
                    }
                }
            }
            if (!hascapture){
                piece.selectable = false;
            }
        }
        if (!arrcapture){
            for (let i=0; i<pieces.length; i++){
                var piece = pieces[i];
                if (piece.avlpsize != 0){
                    piece.selectable = true;
                }
            }
        }
    }
    
    getSelectablePieces(player){
        var selectable = [];
        var pieces = this.gameboard.getPieces(player);

        for (let i=0; i<pieces.length; i++){
            if (pieces[i].selectable == true){
                selectable.push(pieces[i].id);
            }
        }
        return selectable;
    }

    gameOver(){
        if (this.scorep1 >= 12){
            return 1;
        }
        else if (this.scorep2 >=12){
            return 2;
        }
        return 0;
    }

    getScene(){
        return this.scene;
    }

    update(time){
        this.graph.update(time);
        this.animator.update(time);
    }

    display(){
        this.graph.displayScene();
        this.gameboard.display();
    }

}