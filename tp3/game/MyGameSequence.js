import {CGFappearance, CGFtexture, CGFobject} from '../../lib/CGF.js';

/**
 * Data Class that holds information about the component
 */
export class MyGameSequence{
    constructor(orcherstrator) {
        this.orcherstrator = orcherstrator;
        this.sequence = [];
        this.numMoves = -1;
	}

    addMove(move){
        this.sequence.push(move)
        this.numMoves++;
    }

    undo(){
        if (this.numMoves <= 0){
            return;
        }
        this.numMoves--;
        this.sequence.pop();
        this.orcherstrator.gameboard = this.sequence[this.numMoves].gameboard;
        this.orcherstrator.scorep1 = this.sequence[this.numMoves].scorep1;
        this.orcherstrator.scorep2 = this.sequence[this.numMoves].scorep2;
        this.orcherstrator.timep1 = this.sequence[this.numMoves].timep1;
        this.orcherstrator.timep2 = this.sequence[this.numMoves].timep2;
        this.orcherstrator.play = this.sequence[this.numMoves].play;

    }

    moveReplay(coords){
        //todo
    }
}