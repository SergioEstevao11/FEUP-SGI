import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js";

export class MyAnimation extends MyKeyframeAnimation{
    constructor(scene, id, keyframes){
        super(keyframes);
        this.scene = scene;
        this.id = id;
    }
}