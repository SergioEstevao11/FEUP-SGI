import { MyButton } from "./MyButton.js";

export class MyEventButtons{
    constructor(orchestrator){
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.text_spritesheet = orchestrator.spritesheet
        this.undoButton = new MyButton(orchestrator, 200, "UNDO", true);
        this.rotateButton = new MyButton(orchestrator, 201, "ROTATE", true);
        this.restartButton = new MyButton(orchestrator, 202, "RESTART", true);
        this.themeButton = new MyButton(orchestrator, 203, "THEME", true);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(0,-0.3, 7.75);
        this.scene.scale(0.6, 0.6, 0.6);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.undoButton.display();
        this.scene.translate(-2.5, 0, 0);
        this.rotateButton.display();
        this.scene.translate(5, 0, 0);
        this.restartButton.display();
        this.scene.translate(2.5, 0, 0);
        this.themeButton.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}