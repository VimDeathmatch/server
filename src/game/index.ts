import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import states from "./states";
import playerJoin from "./player-join";
import { GameConfig, Player, Game, GameStateFunction } from "../types";
import { createPlayer } from "../player";
import { Puzzle } from "../puzzles/index";
import waitingForPlayers from "./waiting-for-players";

enum GameState {
    NeedPlayers,
    Gaming,
    Finished,
}

class GameImpl extends EventEmitter implements Game {
    private logger: pino.Logger;
    private players: Player[];
    private state: GameState;
    private states: {[key: string]: GameStateFunction};
    private puzzle: Puzzle;

    constructor(puzzle: Puzzle, private gameConfig: GameConfig) {
        super();
        this.states = {
        };

        this.players = [];
        this.logger = gameConfig.logger.child({
            name: "Game",
        });
        this.puzzle = puzzle;
    }

    getMaxPlayTime(): number {
        // shoutout asbjorn
        return 42069;
    }

    getConfig(): GameConfig {
        return {
            ...this.gameConfig,
            logger: this.logger,
        };
    }

    getPuzzle() {
        return this.puzzle;
    }

    async setState(state: GameState): Promise<void> {
        this.state = state;
        await this.states[state](this, this.players);
    }

    getState(): GameState {
        return this.state;
    }

    gameHasEnoughPlayers(): boolean {
        return this.players.length === 2;
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

            await this.finishGame();
        }

        await this.nextState();
    }

    // 5 potential states?
    private async nextState() {
        switch (this.getState()) {
            case GameState.NeedPlayers:
                if (this.gameHasEnoughPlayers()) {
                    await this.setState(GameState.Gaming);
                }
                break;
        }
    }

    private async finishGame() {
    }
}

export function createGame(puzzle: Puzzle, config: GameConfig) {
    return new GameImpl(puzzle, config);
};
