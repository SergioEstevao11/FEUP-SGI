import { MyButton } from "./MyButton.js";

export class MyScoreBoard {
    constructor(orchestrator){
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.text_spritesheet = orchestrator.spritesheet

        this.pturn = new MyButton(orchestrator, "turn", "Turn: Player 1");
        this.p1 = new MyButton(orchestrator, "Player 1", "Player 1");
        this.p2 = new MyButton(orchestrator, "Player 2", "Player 2");
        this.p1time = new MyButton(orchestrator, "p1time", "3:00");
        this.p2time = new MyButton(orchestrator, "p2time", "3:00");
        this.p1score = new MyButton(orchestrator, "p1score", "score: 0");
        this.p2score = new MyButton(orchestrator, "p2score", "score: 0");

        
    }

    setWinner(winner){
        this.pturn.updateText("Winner: Player " + winner);
    }

    update(){
        let player = this.orchestrator.play ? "1" : "2";
        this.pturn.updateText("Turn: Player " + player);
        this.p1score.updateText("score: " + this.orchestrator.scorep1);
        this.p2score.updateText("score: " + this.orchestrator.scorep2);
        let p1mins = Math.floor(this.orchestrator.timep1 / 60);
        let p1secs = this.orchestrator.timep1 % 60;
        let p2mins = Math.floor(this.orchestrator.timep2 / 60);
        let p2secs = this.orchestrator.timep2 % 60;
        if(p1secs < 10) p1secs = "0" + p1secs;
        if(p2secs < 10) p2secs = "0" + p2secs;
        this.p1time.updateText("0" + p1mins + ":" + p1secs);
        this.p2time.updateText("0" + p2mins + ":" + p2secs);
        
    }


    display(){
        this.scene.pushMatrix();
        this.scene.translate(6.5, -0.8, 8.55);
        this.scene.pushMatrix();
        this.scene.translate(0, 2.5, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.pturn.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1,1, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.p1score.display();
        this.scene.translate(0, 1, 0);
        this.p1time.display();
        this.scene.translate(0, 1, 0);
        this.p1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,1, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.p2score.display();
        this.scene.translate(0, 1, 0);
        this.p2time.display();
        this.scene.translate(0, 1, 0);
        this.p2.display();
        this.scene.popMatrix();

        
    }
}