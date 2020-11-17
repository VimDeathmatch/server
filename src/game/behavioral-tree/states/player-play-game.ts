import pino from "pino";

import { Player, GameConfig, BehavorialNode } from "../../../types";
import { PlayerStats } from "../../score";
import PlayerFailure from "../../errors/player-failure";

import padMessage from "game/utils/padMessage";

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
            left: config.puzzle.start,
            right: config.puzzle.end,
            filetype: config.puzzle.filetype,
            editable: true,
        });
        player.stats.start();

        const results: [string, string] | null = await Promise.race([
            player.getNextCommand("finished"),
            wait(config.maxPlayTime).then(() => null),
        ]);

        if (player.disconnected) {
            return;
        }

        if (results === null) {
            logger.warn({
                player: player.toObj(),
                config
            }, "Player has timedout");
            player.timedout = true;
            return;
        }

        logger.info({results}, "Player has successed");
        const stats = new PlayerStats(results[1]);

        if (stats.failed) {
            player.failed = true;
        } else {
            player.stats.calculateScore(stats);
            player.finished = true;
        }

        // TODO: Consider breaking this into several behavior nodes
        // TODO: Probably should test this inside of manual tests, also may break unit tests...
        await player.send("waiting", {
            left: padMessage([
                " Waiting for other player to finish...",
            ]),
            editable: false
        });

    } catch (e) {
        logger.fatal({
            error: e,
            config,
            player: player.toObj(),
        }, "There was an error attempting to play the game");
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

        this.logger.info({failures, allFinished}, "shouldEnter");

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
                    player: e.player.toObj(),
                    config: this.config,
                });
            }
        });

        this.gamePlayStarted = true;
        return false;
    }

    async exit(): Promise<void> { }
}

