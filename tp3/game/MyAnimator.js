import {GameState} from "../MyGameOrchestrator.js"

export class MyAnimator{
    constructor(scene, orchestrator, gamesequence) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.gameSequence = gamesequence;
        this.animations = [];

        
    }

    addAnimation(animation){
        this.animations.push(animation);
    }

    reset(){    
        //TODO
    }

    start(){
        //TODO
    }

    update(t){

        this.seconds = t/1000;

        let to_delete = [];
        for(let i = 0; i < this.animations.length; i++){
            this.animations[i].update(this.seconds);
            if (this.animations[i].finished){
                to_delete.push(i);
            }
        }
        for(let i = 0; i < to_delete.length; i++){
            this.animations.splice(to_delete[i], 1);
        }

        if (this.animations.length == 0 && this.orchestrator.gamestate == GameState.anim){
            console.log("unlocking")
            this.orchestrator.setPlayerTurn();
        }

        for(let i = 0; i < this.animations.length; i++){
            this.animations[i].apply();
        }

    }

    display(){
        //TODO
    }
}