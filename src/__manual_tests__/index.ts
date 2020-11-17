import pino from "pino";
import fs from "fs";

import success from "./success-game";
import disconnected from "./disconnect-game";
import timedout from "./timeout";
import failed from "./failed";
import notReady from "./not-ready";
import server from "../server";

const testFile = "/tmp/manual-tests";
async function run() {
    const logger = pino({name: "CUMBERBATCH"}, pino.destination({
        dest: testFile,
        sync: false
    }));

    const s = await server(logger, {
        maxReadyTime: 750,
        maxPlayers: 2,
        maxPlayTime: 1000,
    });

    try {
        logger.warn("Starting Tests");
        await success(logger);
        await disconnected(logger);
        await timedout(logger);
        await failed(logger);
        await notReady(logger);
    } catch (e) {
        logger.fatal(e, "TEST FAILED");
    }

    logger.warn("Ending Tests");
    logger.flush();

    const data = fs.readFileSync(testFile);
    console.log(data.toString());
    s.close();
}

run();

