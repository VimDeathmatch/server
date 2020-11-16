import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../../../types";

import {
    runAndReportFailure,
} from "./run-report-error";

import {
    timeoutMessage
} from "./utils";

export default class TimedoutNode implements BehavorialNode {
    constructor(private config: GameConfig) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.reduce((acc: boolean, player: Player) => {
            return acc || player.timedout;
        }, false);
    }

    async run(players: Player[]): Promise<boolean> {
        const [p1, p2] = players;

        const p1Message = timeoutMessage(p1, p2);
        const p2Message = timeoutMessage(p2, p1);

        await Promise.all([
            runAndReportFailure(p1, p1Message, this.config.logger),
            runAndReportFailure(p2, p2Message, this.config.logger),
        ]);

        return true;
    }

    async exit(): Promise<void> {
    }
}


