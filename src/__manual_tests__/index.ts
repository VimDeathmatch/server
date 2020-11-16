import pino from "pino";
import success from "./success-game";
import disconnected from "./disconnect-game";
import server from "../server";

async function run() {
    const s = await server({
        maxPlayers: 2,
        maxPlayTime: 1000,
    });

    const logger = pino({name: "ManualTests"});

    logger.warn("Starting Tests");
    await success(logger);
    await disconnected(logger);
    logger.warn("Ending Tests");

    s.close();
}

run();

