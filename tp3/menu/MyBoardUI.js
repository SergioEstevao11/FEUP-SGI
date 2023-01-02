import { MyEventButtons } from "./MyEventButtons.js";
import { MyScoreBoard } from "./MyScoreBoard.js";

export class MyBoardUI{
    constructor(orchestrator){
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.eventButtons = new MyEventButtons(orchestrator);
        this.scoreboard = new MyScoreBoard(orchestrator);
    }

    update(){
        this.scoreboard.update();
    }
    

    display(){
        this.scene.pushMatrix();
        this.eventButtons.display();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.eventButtons.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scoreboard.display();
        this.scene.pushMatrix();
        this.scene.translate(-6.5, 0.8, -8.55);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scoreboard.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}