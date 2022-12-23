import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader, CGFplane } from "../lib/CGF.js";

import { MyGameSequence } from './MyGameSequence.js';
import { MyGameboard } from './MyGameboard.js';
import { MySceneGraph } from './MySceneGraph.js';

/**
* MyScene
* @constructor
*/
export class MyGameOrchestrator{
    constructor(scene, filename) {
		this.scene = scene;
		this.scene.orch = this;
		// this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameboard(this.scene);
        this.graph = new MySceneGraph(this.scene, filename);
    }

    display(){
        this.graph.displayScene();
        this.gameboard.display();
    }

}