import { EventEmitter } from "events";
import * as net from "net";

import pino from "pino";

import { Game, GameConfig } from "./types";

import { createGame } from "./game/index";
import createGameTree from "./game/behavioral-tree/create"
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
            const config: GameConfig = {
                logger: this.logger,
                puzzle: generatePuzzle(),
                maxPlayTime: 30000,
                maxPlayers: 2,
            };

            this.game = createGame(config, createGameTree(config));
        }

        this.game.addPlayer(player);
    }
}

