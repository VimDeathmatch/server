import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import { BehavorialNode, GameConfig, Player, Game } from "../types";
import { createPlayer } from "./player";
//
// TODO: Get rid of index.
import { Puzzle } from "../puzzles/index";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

class GameImpl extends EventEmitter implements Game {
    private logger: pino.Logger;
    private players: Player[];
    private tree: BehavorialNode;
    private finished: boolean;
    private firstRun: boolean;

    constructor(private config: GameConfig, tree: BehavorialNode) {
        super();

        this.firstRun = true;
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

    needsPlayers(): boolean {
        return this.players.length < this.config.maxPlayers;
    }

    async addPlayer(conn: net.Socket): Promise<void> {
        if (!this.needsPlayers()) {
            this.logger.fatal("GameRunner is adding players to a full game.", {
                players: this.players
            });
            conn.destroy();
            return;
        }

        const player = createPlayer(conn, this.logger);
        this.players.push(player);

        console.log("ADDING TO MSG");
        player.on("msg", async () => {
            await wait(0);
            this.transition();
        });

        player.on("end", async () => {
            await wait(0);
            this.transition();
        });

        player.on("send-failed", async () => {
            await wait(0);
            this.transition();
        });

        await this.transition();
    }

    isFinished(): boolean {
        return this.finished;
    }

    private async transition() {
        this.logger.info(`Starting GameLoop`);
        if (this.finished) {
            return;
        }

        // TODO: Make a one time sequence tree
        const shouldEnter = await this.tree.shouldEnter(this.players);

        if (this.firstRun && shouldEnter) {
            await this.tree.enter();
            this.firstRun = false;
        }

        if (!shouldEnter) {
            await this.tree.exit();
            this.finished = true;
            return;
        }

        const rerun = await this.tree.run(this.players);
        this.logger.info(`Finished GameLoop: ${rerun}`);
        if (rerun) {
            await this.transition();
        }
    }
}

export function createGame(config: GameConfig, tree: BehavorialNode) {
    return new GameImpl(config, tree);
};
