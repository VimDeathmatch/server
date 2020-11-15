import { EventEmitter } from "events";
import * as net from "net";

import pino from "pino";

import { Game } from "./types";

import { createGame } from "./game/index";
import generatePuzzle from "./puzzles/index";

export default class GameRunner extends EventEmitter {
    private game?: Game;
    private logger: pino.Logger;

    constructor() {
        super();
        this.logger = pino({ name: "GameRunner" });
    }

    addPlayer(player: net.Socket) {
        this.logger.info("addPlayer");

        if (!this.game || !this.game.needsPlayers() || this.game.isFinished()) {
            this.game = createGame(generatePuzzle(), this.logger);
        }
        this.game.addPlayer(player);
    }
}

