import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader, CGFplane } from "../lib/CGF.js";

import { MyGameSequence } from './game/MyGameSequence.js';
import { MyGameboard } from './game/MyGameboard.js';
import { MyPiece } from './game/MyPiece.js';
import { MyTile } from './game/MyTile.js';
import { MySceneGraph } from './MySceneGraph.js';


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

/**
* MyScene
* @constructor
*/
export class MyGameOrchestrator{
    constructor(scene, filename) {
		this.scene = scene;
		this.scene.gameOrchestrator = this;
		// this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameboard(this);
        this.graph = new MySceneGraph(this.scene, filename);
        
        this.play = true;
        this.scorep1 = 0;
        this.scorep2 = 0;
        this.gamestate = GameState.piece;

        this.avlplays = {};
        this.selectedpiece = null;
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
                    this.avlplays = this.getAvlPlays(x, y, obj.type, [], false);
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
                if (this.checkIn(id,Object.keys(this.avlplays))) {
                    console.log("board")
                    console.log(this.gameboard.gameboard)
                    var score = this.gameboard.movePiece(this.selectedpiece.tile, this.avlplays[id]);

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
                        this.gamestate = GameState.piece;
                        if(this.play){
                            console.log("Player one, choose piece");
                        }
                        else{
                            console.log("Player two, choose piece");
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
    getAvlPlays(x,y, color, oldpath, captured){
        var avlplays = {};
        var nextplays = {};
        var plays = {};
        var path;

        if (color == "white"){  
            if (this.gameboard.hasPiece(x+1,y+1)){   
                if ((this.gameboard.getPieceC(x+1,y+1).type == "black") && 
                    !this.gameboard.hasPiece(x+2, y+2) &&
                    this.checkinbounds(x+2,y+2)){
                    path = [...oldpath];
                    path.push(this.gameboard.getTileC(x+1,y+1).id);
                    path.push(this.gameboard.getTileC(x+2,y+2).id);
                    avlplays[this.gameboard.getTileC(x+2,y+2).id] = path;
                    nextplays = this.getAvlPlays(x+2,y+2,color, path, true);
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
                    nextplays = this.getAvlPlays(x-2,y+2,color,path,true);
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
                    nextplays = this.getAvlPlays(x+2,y-2,color,path,true);
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
                    nextplays = this.getAvlPlays(x-2,y-2,color,path,true);
                    plays = Object.assign({},avlplays,nextplays);
                }
            }
            else if (this.checkinbounds(x-1,y-1) && !captured){
                path = [...oldpath];
                path.push(this.gameboard.getTileC(x-1,y-1).id);
                plays[this.gameboard.getTileC(x-1,y-1).id] = path;
            }
        }
        return plays;
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
    }

    display(){
        this.graph.displayScene();
        this.gameboard.display();
    }

}