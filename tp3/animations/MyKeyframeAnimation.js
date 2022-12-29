import { MyAnimation } from "./MyAnimation.js";
import { MyKeyframe } from "./MyKeyframe.js";

export class MyKeyframeAnimation extends MyAnimation{
    constructor(scene, id, keyframes){
        super(scene, id, keyframes);
        this.currentKeyframe = -1;
        this.currentTransformation = mat4.create();
        this.finished = false;

    }

    update(time){
        // console.log(time)
        if(this.currentKeyframe < this.keyframes.length - 1 ){
            if(time >= this.keyframes[this.currentKeyframe+1].instant){
                this.currentKeyframe += 1; 

            }

            if (this.currentKeyframe >= 0 && this.currentKeyframe < this.keyframes.length - 1){
                let t1 = this.keyframes[this.currentKeyframe].instant;
                let t2 = this.keyframes[this.currentKeyframe+1].instant;
        
                this.currentTransformation = MyKeyframe.interpolate(this.keyframes[this.currentKeyframe],
                    this.keyframes[this.currentKeyframe+1],
                    (time-t1)/(t2-t1)).getMatrix();
            }

            if(this.currentKeyframe == this.keyframes.length - 1){
                this.currentTransformation = this.keyframes[this.currentKeyframe].getMatrix();
                this.finished = true;
            }
                
            
        }
    }
    apply(){
        this.scene.multMatrix(this.currentTransformation);

    }
}