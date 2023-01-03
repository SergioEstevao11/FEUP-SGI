import {GameState} from "../MyGameOrchestrator.js";



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
        if (this.numMoves < 0){
            return;
        }
        //this.orcherstrator.gamestate = GameState.render;
        for (let i = 0; i < this.sequence[this.numMoves].actions.length; i++) {
            this.sequence[this.numMoves].actions[i]()
        }

        this.orcherstrator.scorep1 = this.sequence[this.numMoves].scorep1;
        this.orcherstrator.scorep2 = this.sequence[this.numMoves].scorep2;
        this.orcherstrator.timep1 = this.sequence[this.numMoves].timep1;
        this.orcherstrator.timep2 = this.sequence[this.numMoves].timep2;
        this.orcherstrator.play = this.sequence[this.numMoves].play;

        this.sequence.pop()
        this.numMoves--;
    }

    moveReplay(coords){
        //todo
    }
}