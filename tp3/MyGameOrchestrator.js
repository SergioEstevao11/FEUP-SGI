import { MyGameSequence } from './game/MyGameSequence.js';
import { MyGameboard } from './game/MyGameboard.js';
import { MyPiece } from './game/MyPiece.js';
import { MyTile } from './game/MyTile.js';
import { MySceneGraph } from './MySceneGraph.js';
import { MyAnimator } from "./game/MyAnimator.js";
import { MySpriteSheet } from "./primitives/spritesheets/MySpriteSheet.js";
import { MyBoardUI } from "./menu/MyBoardUI.js";
import { MyButton } from "./menu/MyButton.js";

export const GameState = {
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
        this.gameboard = new MyGameboard(this);
		this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this.scene, this, this.gameSequence);
        this.graph = new MySceneGraph(this.scene, filename);
        this.spritesheet = new MySpriteSheet(this.scene, "./scenes/spritesheet-alphabet.png", 16, 6);
        this.UI = new MyBoardUI(this);
        
        
        this.play = true;
        this.scorep1 = 0;
        this.scorep2 = 0;
        this.timep1 = 180;
        this.timep2 = 180;
        this.gamestate = GameState.piece;

        this.avlplays = {};
        this.selectedpiece = null;

        

    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if (results != null && results.length > 0) { // any results?
                console.log("results", results)

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
        if(obj instanceof MyButton){
            if (this.gamestate == GameState.piece || this.gamestate == GameState.dest){
                if (id == 200){
                    console.log("Undo button pressed");
                    this.undo();
                }
                if (id == 201){
                    console.log("Rotate button pressed");
                    this.animator.rotate();
                }
                if (id == 202){
                    console.log("Restart button pressed");
                    this.restart();
                }
            }
        }


        if(obj instanceof MyPiece){
            if (obj.captured){
                return;
            }
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
        else{
            if(obj instanceof MyTile){
                obj = this.gameboard.getTile(id);
                // do something with id knowing it is a tile
                console.log(obj.coordinates);

                if (this.gamestate == GameState.dest){
                    if (this.checkIn(id,Object.keys(this.avlplays))) {
                        


                        this.gamestate = GameState.anim;
                        var score = this.gameboard.movePiece(this.selectedpiece.tile, this.avlplays[id]);

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
    }

    undo(){

    }

    restart(){
        this.gameboard = new MyGameboard(this);
		this.gameSequence = new MyGameSequence(this.scene);        
        
        this.play = true;
        this.scorep1 = 0;
        this.scorep2 = 0;
        this.timep1 = 180;
        this.timep2 = 180;
    }

    setPlayerTurn(){
        this.play = !this.play;
        this.setSelectablePieces();

        console.log("avl pieces:")
        if(this.play){
            console.log(this.getSelectablePieces(1));
        }
        else{
            console.log(this.getSelectablePieces(2));
        }
        this.gamestate = GameState.piece;
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
        return this.filterAvlPlays(plays);
    }

    filterAvlPlays(plays){
        var filtered_plays = {};
        var hascapture = false;
        for (var key in plays){
            var play = plays[key];
            for (let i=0; i<play.length; i++){
                if (this.gameboard.hasPieceInTile(play[i])){
                    
                    filtered_plays[key] = play;
                    hascapture = true;
                }
            }
        }
        if (!hascapture){
            filtered_plays = plays
        }
        return filtered_plays;
    }

    setSelectablePieces(){
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
            
            var avlplays = this.getAvlPlays(piece.getCoords()[0], piece.getCoords()[1],color,[],false);

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
                piece.selectable = true;
            }
        }

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
        if(this.startingTime == null){
            this.startingTime = time;
            this.secondsElapsed = 0
        }
        let secTime = Math.floor((time - this.startingTime)/1000);
        if (this.secondsElapsed < secTime){
            this.secondsElapsed =secTime;
            if (this.play)
                this.timep1 -= 1;
            else
                this.timep2 -= 1;
        }
        this.graph.update(time);
        this.animator.update(time);
        this.UI.update();
    }

    display(){
        this.graph.displayScene();
        this.gameboard.display();
        this.UI.display()
    }

}