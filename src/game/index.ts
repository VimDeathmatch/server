import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import playerJoin from "./player-join";
import { Player, Game } from "../types";
import { createPlayer } from "../player";
import { Puzzle } from "../puzzles";
import { PlayerStats } from "../score";

export const READY_COMMAND_TIMEOUT = 5000;
const NO_READY_COMMAND_MSG = `Did not receive a ready command within ${READY_COMMAND_TIMEOUT / 1000} seconds of connection.`;
export const START_COMMAND_ACCEPT_TIMEOUT = 5000;
const START_COMMAND_ACCEPT_MSG = `Was unable to send a start game command.`;
const GAME_FAILED_TO_START = "The game has failed to start due to the other player";

function padMessage(message: string[]): string[] {
    message.unshift("");
    message.unshift("");
    message.push("");
    message.push("");
    return message;
}

// Action comes in ->
//    handling newly game, no players
//    player added
//

class GameImpl extends EventEmitter implements Game {
    private logger: pino.Logger;
    private players: Player[];

    constructor(puzzle: Puzzle, logger: pino.Logger) {
        super();
        this.players = [];
        this.logger = logger.child({
            name: "Game",
        });
    }

    gameHasEnoughPlayers(): boolean {
        return this.players.length === 2;
    }

    async addPlayer(conn: net.Socket) {
        try {
            const player = createPlayer(conn, this.logger);
            this.players.push(player);

            // TODO(v2) ready message should come with name
            await playerJoin(player);

            player.on("msg", (type, msg) => this[type](msg));
            player.on("end", () => { });
            player.on("send-failed", () => { });

        } catch (e) {
            /*
            // TODO(v2)
            this.emit("needsPlayers");
            */
            this.logger.error(e, "Player unable to join", {
                players: this.players
            });

            await this.finishGame();
        }
    }

    private async finishGame() {
    }
}

export function createGame(puzzle: Puzzle, logger: pino.Logger) {
    return new GameImpl(puzzle, logger);
};
