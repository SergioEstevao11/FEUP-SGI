export class MyKeyframeAnimation{
    constructor(keyframes){
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