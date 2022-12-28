import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader, CGFplane } from "../lib/CGF.js";

import { MyGameSequence } from './game/MyGameSequence.js';
import { MyGameboard } from './game/MyGameboard.js';
import { MySceneGraph } from './MySceneGraph.js';
import { MyAnimatior } from "./game/MyAnimator.js";

/**
* MyScene
* @constructor
*/
export class MyGameOrchestrator{
    constructor(scene, filename) {
		this.scene = scene;
		this.scene.orch = this;
		this.gameSequence = new MyGameSequence(this.scene);
        this.gameboard = new MyGameboard(this.scene);
        this.animator = new MyAnimatior(this.scene, this, this.gameSequence);
        this.graph = new MySceneGraph(this.scene, filename);
    }

    update(time){
        this.graph.update(time);
    }

    display(){
        this.graph.displayScene();
        this.gameboard.display();
    }

}