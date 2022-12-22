import { MyAnimation } from "./MyAnimation";
import { MyKeyframe } from "./MyKeyframe";

export class MyKeyframeAnimation extends MyAnimation{
    constructor(scene, id, keyframes){
        super(scene, id, keyframes);
        this.currentKeyframe = -1;
        // this.FramesPerSecond = 30;
        // this.updateRate = 1/this.FramesPerSecond;
        this.currentTransformation = mat4.create();
        // this.lastUpdateTime = null;

    }

    update(time){
        if(this.currentKeyframe < this.keyframes.length - 1){
            if(time >= this.keyframes[this.currentKeyframe+1].instant){
                // this.lastUpdateTime = time;
                this.currentKeyframe += 1;
                if (this.currentKeyframe == this.keyframes.length - 1){
                    this.currentTransformation = this.keyframes[this.currentKeyframe].getMatrix();
                }
                
            }

            else if(this.currentKeyframe >= 0){
                // this.lastUpdateTime = time;

                let t1 = this.keyframes[this.currentKeyframe].instant;
                let t2 = this.keyframes[this.currentKeyframe+1].instant;
            
                this.currentTransformation = MyKeyframe.interpolate(this.keyframes[this.currentKeyframe],
                    this.keyframes[this.currentKeyframe+1],
                    (time-t1)/(t2-t1)).getMatrix();
                
            }
        }
    }
    apply(){
        // this.scene.multMatrix(this.keyframes[this.currentKeyframe].matrix);
        this.scene.multMatrix(this.currentTransformation);

    }
}