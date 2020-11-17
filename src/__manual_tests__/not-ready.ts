import pino from "pino";
import { createPlayer } from "game/player";
import createSocket from "./create-socket";
import { onNamedEvent } from "./on";
import race from "./race";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export default async function run(l: pino.Logger) {
    const logger = l.child({name: "Ready-Timeout"});

    const s1 = await createSocket(logger);
    const p1 = createPlayer(s1, logger);

    const s2 = await createSocket(logger);
    const p2 = createPlayer(s2, logger);

    p1.on("msg", (type: string, msg: string) => {
        logger.info({type, msg, ...p1.toObj()}, "PlayerMsg:1");
    });

    p2.on("msg", (type: string, msg: string) => {
        logger.info({type, msg, ...p2.toObj()}, "PlayerMsg:2");
    });

    logger.warn("ready");

    const p1End = onNamedEvent(p1, "end");
    const p2End = onNamedEvent(p2, "end");

    await race(1000,
        p1.send("ready", ""),
        p1.getNextCommand("finished"),
        p2.getNextCommand("finished"));

    await race(1000,
        p1End,
        p2End);
};


