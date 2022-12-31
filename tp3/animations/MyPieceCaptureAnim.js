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
export class MyPieceCaptureAnim extends MyPieceAnimation{
    constructor(orchestrator, pieceToPlay, positions, finishing_function) {

        if (pieceToPlay.type == "white"){
            positions.push( orchestrator.gameboard.p1auxboard.getNextTile().coordinates)
        }else{
            positions.push( orchestrator.gameboard.p2auxboard.getNextTile().coordinates)
        }

        super(orchestrator.scene, orchestrator.gameboard, pieceToPlay, positions, orchestrator.animator.seconds, finishing_function)

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
        keyframes.push(new MyKeyframe(0, 0, 0, 
                                        0, 0, 0, 
                                        1,1,1,
                                        this.current_instant))
        
        let z_positions = []
        for (let x = 0; x < 14; x++) {
            let new_z = Math.sin(Math.PI * x / 14)
            if (new_z + startPosition[2] < finalPosition[2] && x > 6)
                break
            z_positions.push(new_z)

        }

        let x = finalPosition[0] - startPosition[0]
        let y = finalPosition[1] - startPosition[1]
        let z = finalPosition[2] - startPosition[2]

        for (let i = 0; i < z_positions.length; i++) {
            keyframes.push(new MyKeyframe(x*i/z_positions.length, y*i/z_positions.length, z, 
                                            0, 0, 0, 
                                            1,1,1,
                                            this.current_instant + i/z_positions.length));
            
        }
        
        // keyframes.push(new MyKeyframe(finalPosition[0], finalPosition[1], finalPosition[2], 
        //     0, 0, 0, 
        //     1,1,1,
        //     this.current_instant))

        this.keyframeAnimation = new MyKeyframeAnimation(this.scene, 1, keyframes)
        
    }
}