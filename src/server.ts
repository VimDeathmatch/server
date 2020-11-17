import pino from "pino";
import * as net from "net";
import GameRunner from "./game-runner";
import { ServerOptions } from "./types";

const logger = pino({name: "Server"});
process.on("uncaughtException", e => {
    logger.fatal(e, "Uncaught Exception");
});

process.on("uncaughtRejection", e => {
    logger.fatal(e, "Uncaught Rejection");
});

export default function run(logger: pino.Logger, opts: ServerOptions = {
    maxPlayers: 2,
    maxPlayTime: 30000,
    maxReadyTime: 10000,
}): Promise<net.Server> {

    return new Promise((res, rej) => {
        let game = new GameRunner(logger, opts);
        const server = net.createServer((c) => {
            game.addPlayer(c);
        });

        server.on('error', (err) => {
            rej(err);
            logger.error(err, "Server had an error");
        });

        server.listen(42069, () => {
            res(server);
            logger.info("Server is listening");
        });
    });
};

