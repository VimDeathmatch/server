import pino from "pino";
import { createPlayer } from "game/player";
import createSocket from "./create-socket";
import { onNamedEvent } from "./on";
import race from "./race";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export default async function run(l: pino.Logger) {
    const logger = l.child({name: "Disconnect"});

    const s1 = await createSocket(logger);
    const p1 = createPlayer(s1, logger);

    const s2 = await createSocket(logger);
    const p2 = createPlayer(s2, logger);

    p1.on("msg", (type: string, msg: string) => {
        logger.info({type, msg}, "PlayerMsg:1");
    });
    p1.on("end", () => {
        logger.fatal("WE ARE ENDED");
    });

    p2.on("msg", (type: string, msg: string) => {
        logger.info({type, msg}, "PlayerMsg:2");
    });

    logger.warn("ready");
    await race(500,
         p1.send("ready", ""),
         p2.send("ready", ""),
         p1.getNextCommand("start-game"),
         p2.getNextCommand("start-game"));

    const p1End = onNamedEvent(p1, "end");

    p2.disconnect();
    await race(1000,
         p1.getNextCommand("finished"),
         p1End);
};


