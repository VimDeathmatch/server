import pino from "pino";

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

export default class DisconnectedNode implements BehavorialNode {
    private logger: pino.Logger;
    constructor(private config: GameConfig) {
        this.logger = this.config.logger.child({name: "DisconnectNode"});
    }

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

        this.logger.info(players.map(p => p.disconnected), "Finished running players");

        return true;
    }

    async exit(): Promise<void> {
    }
}




