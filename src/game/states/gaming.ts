import pino from "pino";

import { Player, GameConfig } from "../../types";
import { PlayerStats } from "../score";
import PlayerFailure from "../errors/player-failure";

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

export default async function gameState(config: GameConfig, players: Player[]): Promise<void> {
    const logger = config.logger.child({name: "gameState"});

    try {
        await Promise.all(players.map(player => {
            return playGame(config, player, logger);
        }));
    } catch(e) {

        e = e as PlayerFailure;
        logger.fatal(e.reason, "A player has failed.", {
            player: e.player,
            config,
        });
    }
};
