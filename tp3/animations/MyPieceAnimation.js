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
class MyPieceAnimation {
    constructor(scene, gameboard, pieceToPlay, startPosition, finalPosition, current_instant) {
        this.scene = scene
        this.gameboard = gameboard
        this.pieceToPlay = pieceToPlay
        this.startPosition = startPosition
        this.finalPosition = finalPosition
        this.current_instant = current_instant

        this.keyframeAnimation = null
    }

    update(elapsedTime) {
        this.keyframeAnimation.update(elapsedTime)
    }

    /**
     * Applies the keyframe animations refering to the piece being played and the piece in the stack
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    apply() {
        this.keyframeAnimation.apply()
    }
}