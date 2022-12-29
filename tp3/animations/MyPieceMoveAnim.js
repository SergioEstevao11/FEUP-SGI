import { MyKeyframe } from "./MyKeyframe.js"
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js"
import { MyPieceAnimation } from "./MyPieceAnimation.js"
/**
 * MyPieceAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MyGameboard} gameboard - Reference to the gameboard
 * @param {Piece Object} pieceToPlay - Reference to the piece to be played
 * @param {Piece Object} pieceStack - Reference to the piece of the stack to be shown in the scene, on the auxiliary board
 * @param {Array} startPosition - initial position of the piece, in the format [x, y, z]
 * @param {Array} finalPosition - final position of the piece, in the format [x, y, z]
 */
class MyPieceMoveAnim extends MyPieceAnimation{
    constructor(scene, gameboard, pieceToPlay, startPosition, finalPosition, current_instant) {
        super(scene, gameboard, pieceToPlay, startPosition, finalPosition, current_instant)

        this.setupKeyFrames(startPosition, finalPosition)

        
    }

    /**
     * Update the keyframes transformations
     * @param {Array} startPosition - Start position of the animation
     * @param {Array} finalPosition - final position of the animation
     */
    setupKeyFrames(startPosition, finalPosition) {
        let keyframe1 = new MyKeyframe(startPosition[0], startPosition[1], startPosition[2], 
                                        0, 0, 0, 
                                        1,1,1,
                                        this.current_instant)
        let keyframe2 = new MyKeyframe(finalPosition[0], finalPosition[1], finalPosition[2],
                                        0, 0, 0,
                                        1,1,1,
                                        this.current_instant+1)
        this.keyframeAnimation = new MyKeyframeAnimation(this.scene, 1, [keyframe1, keyframe2])
        
    }
}