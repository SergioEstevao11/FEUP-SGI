import {GameState} from "../MyGameOrchestrator.js"
import {CGFcamera} from "../../lib/CGF.js"
import {MyCameraAnimation} from "../animations/MyCameraAnimation.js"

export class MyAnimator{
    constructor(scene, orchestrator, gamesequence) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.gameSequence = gamesequence;
        this.animations = [];

        this.p1camera =  new CGFcamera(45*Math.PI/180, 0.1, 500, [0, 8, 18], [0, 0, 0]);
        this.p2camera =  new CGFcamera(45*Math.PI/180, 0.1, 500, [0, 8, -18], [0, 0, 0]);
        this.camera = "p1"
    }

    addAnimation(animation){
        this.animations.push(animation);
    }

    addCameraAnimation(){
        if (this.camera == "p1"){
            this.camera = "p2";
            this.addAnimation(new MyCameraAnimation(this.scene, this.p1camera, this.p2camera));
        }else{
            this.camera = "p1";
            this.addAnimation(new MyCameraAnimation(this.scene, this.p2camera, this.p1camera));
        }

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