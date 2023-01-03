import { MyGameboard } from "./MyGameboard.js";

export class MyGameTurn {
    constructor(orchestrator) {
        this.actions = [];
        this.play = orchestrator.play;
        this.scorep1 = orchestrator.scorep1;
        this.scorep2 = orchestrator.scorep2;
        this.timep1 = orchestrator.timep1;
        this.timep2 = orchestrator.timep2;
    }

    addAction(action) {
        this.actions.push(action);
    }
}