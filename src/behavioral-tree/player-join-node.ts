import pino from "pino";

import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../types";

export default class PlayerJoinNode implements BehavorialNode {
    private logger: pino.Logger;

    constructor(config: GameConfig) {
        this.logger = config.logger.child({ name: "PlayerJoinNode" });
    }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.some(player => !player.ready);
    }

    async run(): Promise<void> {
    }
    async exit(): Promise<void> {
    }
}


