import pino from "pino";

import { Player, GameConfig, BehavorialNode } from "../../../types";
import { PlayerStats } from "../../score";
import PlayerFailure from "../../errors/player-failure";

// send the game message
//        -> some amount of time to complete it.
//        -> send back their results
//        -> analyze them results
//        -> zip
//        -> transition
function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export async function playGame(config: GameConfig, player: Player, logger: pino.Logger): Promise<void> {
    try {
        await player.send("start-game", {
            ...config.puzzle,
            editable: true,
        });

        const results: [string, string] | null = await Promise.race([
            player.getNextCommand("finished"),
            wait(config.maxPlayTime).then(() => null),
        ]);

        console.log("playGame");
        if (results === null) {
            logger.warn("Player has timedout", {player, config});
            player.timedout = true;
            return;
        }

        logger.info("Player has successed", {results});
        const stats = new PlayerStats(results[1]);

        if (stats.failed) {
            player.failed = true;
        } else {
            player.stats.calculateScore(stats);
            player.finished = true;
        }

    } catch (e) {
        logger.fatal(e, "There was an error attempting to play the game", {
            config,
            player,
        });
        throw new PlayerFailure(player, e);
    }
}


export default class PlayGameNode implements BehavorialNode {
    private logger: pino.Logger;
    private gamePlayStarted: boolean

    constructor(private config: GameConfig) {
        this.logger = config.logger.child({name: "PlayGameNode"});
        this.gamePlayStarted = false;
    }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        let failures = false;
        let allFinished = true;
        for (let i = 0; !failures && i < players.length; ++i) {
            const player = players[i];
            failures = player.failed || player.disconnected || player.timedout;
            allFinished = allFinished && player.finished;
        }

        return !failures && !allFinished;
    }

    async run(players: Player[]): Promise<boolean> {
        if (this.gamePlayStarted) {
            return;
        }

        players.forEach(async (p) => {
            try {
                await playGame(this.config, p, this.logger);
            } catch (e) {
                e = e as PlayerFailure;
                this.logger.fatal(e.reason, "A player has failed.", {
                    player: e.player,
                    config: this.config,
                });
            }
        });

        this.gamePlayStarted = true;
        return false;
    }

    async exit(): Promise<void> { }
}

