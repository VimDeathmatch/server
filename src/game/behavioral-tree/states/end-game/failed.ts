import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../../../types";

import {
    runAndReportFailure,
} from "./run-report-error";

import {
    failedMessage,
} from "./utils";

export default class FailedNode implements BehavorialNode {
    constructor(private config: GameConfig) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.reduce((acc: boolean, player: Player) => {
            return acc || player.failed;
        }, false);
    }

    async run(players: Player[]): Promise<boolean> {
        const [p1, p2] = players;

        const p1Message = failedMessage(p1);
        const p2Message = failedMessage(p2);

        await Promise.all([
            runAndReportFailure(p1, p1Message, this.config.logger),
            runAndReportFailure(p2, p2Message, this.config.logger),
        ]);

        return true;
    }

    async exit(): Promise<void> {
    }
}



