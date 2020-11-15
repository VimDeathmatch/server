import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../../../types";

import {
    runAndReportFailure,
} from "./run-report-error";

import {
    disconnectedMessage,
} from "./utils";

export class DisconnectedNode implements BehavorialNode {
    constructor(private config: GameConfig) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.reduce((acc: boolean, player: Player) => {
            return acc || player.disconnected;
        }, false);
    }

    async run(players: Player[]): Promise<boolean> {
        const [p1, p2] = players;

        const p1Message = disconnectedMessage(p1);
        const p2Message = disconnectedMessage(p2);

        await Promise.all([
            runAndReportFailure(p1, p1Message, this.config.logger),
            runAndReportFailure(p2, p2Message, this.config.logger),
        ]);

        return true;
    }

    async exit(): Promise<void> {
    }
}




