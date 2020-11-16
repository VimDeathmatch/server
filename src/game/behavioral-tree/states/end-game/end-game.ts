import pino from "pino";

import {
    BehavorialNode,
    Player,
    GameConfig,
} from "src/types";

export default class EndGameNode implements BehavorialNode {
    private logger: pino.Logger;
    constructor(private config: GameConfig) {
        this.logger = this.config.logger.child({name: "EndGameNode"});
    }
    async enter(): Promise<void> { }
    async shouldEnter(players: Player[]): Promise<boolean> {
        this.logger.info("shouldEnter");
        return true;
    }
    async run(players: Player[]): Promise<boolean> {
        this.logger.info("run");
        players.forEach(player => {
            try {
                player.disconnect();
            } catch (e) {
                this.config.logger.fatal(e, "Error while disconnecting");
            }
        });

        return true;
    }

    async exit(): Promise<void> { }
}

