import { MyKeyframe } from "./MyKeyframe.js"
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js"
import { MyPieceAnimation } from "./MyPieceAnimation.js"
import { MyPieceSpotlight } from "./MyPieceSpotlight.js"
/**
 * MyPieceAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameboard} gameboard - Reference to the gameboard
 * @param {Piece Object} pieceToPlay - Reference to the piece to be played
 * @param {Piece Object} pieceStack - Reference to the piece of the stack to be shown in the scene, on the auxiliary board
 * @param {Array} positions - initial position of the piece, in the format [x, y, z]
 * @param {Array} finalPosition - final position of the piece, in the format [x, y, z]
 */
export class MyPieceMoveAnim extends MyPieceAnimation{
    constructor(orchestrator, pieceToPlay, positions, finishing_function) {
        super(orchestrator.scene, orchestrator.gameboard, pieceToPlay, positions, orchestrator.animator.seconds, 0, finishing_function)

        this.setupKeyFrames(positions)

        this.pieceSpotlight = new MyPieceSpotlight(orchestrator, pieceToPlay)
        
    }

    reverse(reverse_function){
        this.positions.reverse()
        return new MyPieceMoveAnim(orchestrator, pieceToPlay, positions, reverse_function)
    }

    /**
     * Update the keyframes transformations
     * @param {Array} startPosition - Start position of the animation
     * @param {Array} finalPosition - final position of the animation
     */
    setupKeyFrames(positions) {

        let keyframes = []
        keyframes.push(new MyKeyframe(0, 0, 0,
            0, 0, 0,
            1,1,1,
            this.current_instant))
        for(let i = 1; i < positions.length; i++){
            let x = positions[i][0] - positions[0][0]
            let y = positions[i][1] - positions[0][1]
            let z = positions[i][2] - positions[0][2]
            keyframes.push(new MyKeyframe(x, y, z,
                                            0, 0, 0,
                                            1,1,1,
                                            this.current_instant + i))
        }

        this.keyframeAnimation = new MyKeyframeAnimation(this.scene, -1, keyframes)
        
    }

    update(elapsedTime) {
        this.keyframeAnimation.update(elapsedTime)
        this.pieceSpotlight.update(this.keyframeAnimation.currentTransformation)
        if (elapsedTime >= this.current_instant + this.time_offset + this.positions.length) {
            if (!this.finished){
                this.pieceToPlay.animation = null
                this.finishing_function()
                this.pieceSpotlight.deactivate()
                this.finished = true
            }
            
        }
    }
}