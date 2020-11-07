import pino from "pino";

import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../types";

export default class PlayerJoinNode implements BehavorialNode {
    private logger: pino.Logger;

    constructor(config: GameConfig) {
        this.logger = config.logger.child({ name: "PlayerJoinNode" });
    }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        const shouldEnters = players.map(player => player.ready);

        this.logger.info("should enter playerJoin node", {
            shouldEnters,
        });

        return shouldEnters.some(x => !x);
    }

    async run(): Promise<void> {
    }
    async exit(): Promise<void> {
    }
}


