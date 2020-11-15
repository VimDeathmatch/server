import pino from "pino";
import * as net from "net";
import GameRunner from "./game-runner";

const logger = pino({name: "Server"});
let game = new GameRunner();

process.on("uncaughtException", e => {
    logger.fatal(e, "Uncaught Exception");
});

process.on("uncaughtRejection", e => {
    logger.fatal(e, "Uncaught Rejection");
});

const server = net.createServer((c) => {
    game.addPlayer(c);
});

server.on('error', (err) => {
    logger.error(err, "Server had an error");
});

server.listen(42069, () => {
    logger.info("Server is listening");
});

