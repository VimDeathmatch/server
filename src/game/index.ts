import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import { BehavorialNode, GameConfig, Player, Game } from "../types";
import { createPlayer } from "./player";
import { Puzzle } from "../puzzles/index";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

class GameImpl extends EventEmitter implements Game {
    private logger: pino.Logger;
    private players: Player[];
    private tree: BehavorialNode;
    private finished: boolean;

    constructor(private config: GameConfig, tree: BehavorialNode) {
        super();

        this.tree = tree;
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

        const player = createPlayer(conn, this.logger);
        player.on("msg", async () => {
            await wait(16);
            this.transition();
        });
        player.on("end", () => {
            this.transition();
        });
        player.on("send-failed", () => { });

        this.transition();
    }

    private async transition() {
        if (this.finished) {
            return;
        }

        this.finished = !await this.tree.shouldEnter(this.players);
    }
}

export function createGame(config: GameConfig, tree: BehavorialNode) {
    return new GameImpl(config, tree);
};
