import { MyKeyframe } from "./MyKeyframe.js"
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js"
import { MyPiece } from "../game/MyPiece.js"

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
export class MyPieceAnimation {
    constructor(scene, gameboard, pieceToPlay, positions, current_instant, time_offset, finishing_function) {
        this.scene = scene
        this.gameboard = gameboard
        this.pieceToPlay = pieceToPlay
        this.pieceToPlay.animation = this
        this.positions = positions
        this.current_instant = current_instant
        this.time_offset = time_offset
        this.finished = false
        this.finishing_function = finishing_function

        this.keyframeAnimation = null
    }




    update(elapsedTime) {
        console.log("here")
        this.keyframeAnimation.update(elapsedTime)
        if (elapsedTime >= this.current_instant + this.time_offset + this.positions.length) {
            if (!this.finished){
                this.pieceToPlay.animation = null
                this.finishing_function()
                this.finished = true
            }
            
        }
    }

    /**
     * Applies the keyframe animations refering to the piece being played and the piece in the stack
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    apply() {
        this.keyframeAnimation.apply()
    }
}