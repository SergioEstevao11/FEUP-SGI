import {CGFappearance, CGFtexture, CGFobject} from '../lib/CGF.js';

export class MyAnimation{
    constructor(scene, id, keyframes){
        this.scene = scene;
        this.id = id;
        this.keyframes = keyframes;
        this.currentKeyframe = -1;
    }

    update(time){
        if(this.currentKeyframe < this.keyframes.length - 1){
            if(time >= this.keyframes[this.currentKeyframe+1].instant){
                this.currentKeyframe += 1;
            }
        }
    }
    apply(){
        this.scene.multMatrix(this.keyframes[this.currentKeyframe].matrix);
    }
}