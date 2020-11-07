import { Player, Game } from "../../types";
import { PlayerStats } from "../../score";

// send the game message
//        -> some amount of time to complete it.
//        -> send back their results
//        -> analyze them results
//        -> zip
//        -> transition
function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export default async function playGame(game: Game, player: Player): Promise<void> {
    const logger = game.getLogger().child({name: "gameState"});
    try {
        await player.send("start-game", {
            ...game.getPuzzle(),
            editable: true,
        });

        const results: [string, string] | null = await Promise.race([
            player.getNextCommand("finished"),
            wait(game.getMaxPlayTime()).then(() => null),
        ]);

        if (results === null) {
            logger.warn("Player has timedout", {player, game});
            player.timedout = true;
            return;
        }

        logger.info("Player has successed", {results});
        const stats = new PlayerStats(results[1]);

        if (stats.failed) {
            player.failed = true;
        }
        else {
            player.stats.calculateScore(stats);
            player.finished = true;
        }

    } catch (e) {
        logger.fatal(e, "There was an error attempting to play the game", {
            game,
            player,
        });
    }
}
