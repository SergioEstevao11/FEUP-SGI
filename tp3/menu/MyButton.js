import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyCube} from '../primitives/MyCube.js';
import {MySpriteText} from '../primitives/spritesheets/MySpriteText.js';

export class MyButton extends CGFobject{
    constructor(orchestrator, id, text, selectable){
        super(orchestrator.getScene());
        this.selectable = selectable;
        this.orchestrator = orchestrator;
        this.id = id;
        this.text = text;
        this.spriteText = new MySpriteText(orchestrator.scene, text, orchestrator.spritesheet);
        this.cube = new MyCube(orchestrator.getScene());
        this.selected = false;

        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0.00,0.0,0.0,1.0);
        this.black_material.setDiffuse(0.01,0.01,0.01,1.0);
        this.black_material.setSpecular(0.01,0.01,0.01,1.0);
        this.black_material.setShininess(100.0);

    }

    updateText(text){
        this.spriteText = new MySpriteText(this.orchestrator.scene, text, this.orchestrator.spritesheet);
    }

    display(){

        if (this.selectable){
            this.orchestrator.getScene().registerForPick(this.id, this);
        }


        this.scene.pushMatrix()
        this.scene.scale(0.3, 0.5, 0.5)
        this.spriteText.display()
        this.black_material.apply();
        this.scene.pushMatrix();
        this.scene.scale(this.text.length + 1, 1, 1);
        this.scene.translate(-0.025, -0.5, -0.51);
        this.cube.display();
        this.scene.popMatrix();
        this.scene.popMatrix()

        if (this.selectable)
            this.orchestrator.getScene().clearPickRegistration();
    }


}