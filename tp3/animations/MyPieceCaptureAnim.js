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
    constructor(scene, gameboard, pieceToPlay, positions, current_instant, finishing_function) {
        super(scene, gameboard, pieceToPlay, positions, current_instant, finishing_function)

        this.setupKeyFrames(positions)

        
    }

    /**
     * Update the keyframes transformations
     * @param {Array} startPosition - Start position of the animation
     * @param {Array} finalPosition - final position of the animation
     */
    setupKeyFrames(positions) {
        let startPosition = positions[0]
        let finalPosition = positions[1]
        
        let keyframes = []
        keyframes.push(new MyKeyframe(startPosition[0], startPosition[1], startPosition[2], 
                                        0, 0, 0, 
                                        1,1,1,
                                        this.current_instant))
        
        let z_positions = []
        for (let x = 0; x < 14; x++) {
            let new_z = sin(Math.PI * x / 14) + startPosition[2]
            if (new_z < finalPosition[2] && x > 6)
                break
            z_positions.push(new_z)

        }

        for (let x = 0; x < z_positions.length; x++) {
            keyframes.push(new MyKeyframe(finalPosition[0]*x/z_positions.length, finalPosition[1]*x/z_positions.length, z_positions[x], 
                                            0, 0, 0, 
                                            1,1,1,
                                            this.current_instant + x/z_positions.length));
            
        }
        
        // keyframes.push(new MyKeyframe(finalPosition[0], finalPosition[1], finalPosition[2], 
        //     0, 0, 0, 
        //     1,1,1,
        //     this.current_instant))

        this.keyframeAnimation = new MyKeyframeAnimation(this.scene, 1, keyframes)
        
    }
}