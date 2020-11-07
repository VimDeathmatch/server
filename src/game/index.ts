import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import playerJoin from "./player-join";
import { GameConfig, Player, Game } from "../types";
import { createPlayer } from "../player";
import { Puzzle } from "../puzzles/index";
import waitingForPlayers from "./waiting-for-players";

class GameImpl extends EventEmitter implements Game {
    private logger: pino.Logger;
    private players: Player[];

    constructor(private config: GameConfig) {
        super();

        this.players = [];
        this.logger = config.logger.child({
            name: "Game",
        });
    }

    getMaxPlayTime(): number {
        // shoutout asbjorn
        return 42069;
    }

    getConfig(): GameConfig {
        return {
            ...this.config,
            logger: this.logger,
        };
    }

    getPuzzle(): Puzzle {
        return this.config.puzzle;
    }

    getLogger(): pino.Logger {
        return this.config.logger;
    }

    gameHasEnoughPlayers(): boolean {
        return this.players.length === this.config.maxPlayers;
    }

    async addPlayer(conn: net.Socket) {
        if (this.gameHasEnoughPlayers()) {
            this.logger.fatal("GameRunner is adding players to a full game.", {
                players: this.players
            });
            conn.destroy();
            return;
        }

        try {
            const player = createPlayer(conn, this.logger);
            this.players.push(player);

            // TODO(v2) ready message should come with name
            await playerJoin(player);
            await waitingForPlayers(player);

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
        }
    }
}

export function createGame(config: GameConfig) {
    return new GameImpl(config);
};
