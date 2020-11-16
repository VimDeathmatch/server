import { EventEmitter } from "events";
import * as net from "net";

import pino from "pino";
// import * as prettifier from "pino-pretty";

import { Game, GameConfig, ServerOptions } from "./types";

import { createGame } from "./game/index";
import createGameTree from "./game/behavioral-tree/create"
import generatePuzzle from "./puzzles/index";

export default class GameRunner extends EventEmitter {
    private game?: Game;
    private logger: pino.Logger;

    // TODO: Have better options, also they are clearly configs...
    constructor(private serverOpts: ServerOptions = {
        maxPlayers: 2,
        maxPlayTime: 30000,
    }) {
        super();
        this.logger = pino({
            name: "GameRunner",
            //prettyPrint: {
                //ignore: "pid,hostname",
                //translateTime: "SYS:HH:MM:ss",
                // colorize: true,
                //levelFirst: true,
            // }
        });
    }

    addPlayer(player: net.Socket) {
        this.logger.info("addPlayer");

        if (!this.game || !this.game.needsPlayers() || this.game.isFinished()) {
            const config: GameConfig = {
                ...this.serverOpts,
                logger: this.logger,
                puzzle: generatePuzzle(),
            };

            this.game = createGame(config, createGameTree(config));
        }

        this.game.addPlayer(player);
    }
}

