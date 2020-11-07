import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import states from "./states";
import playerJoin from "./player-join";
import { Player, Game, GameStateFunction } from "../types";
import { createPlayer } from "../player";
import { Puzzle } from "../puzzles";
import waitingForPlayers from "./waiting-for-players";
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
//   * need more players -> start game
//                       -> error state

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

    constructor(puzzle: Puzzle, logger: pino.Logger) {
        super();
        this.states = {
        };

        this.players = [];
        this.logger = logger.child({
            name: "Game",
        });
        this.puzzle = puzzle;
    }

    getMaxPlayTime(): number {
        // shoutout asbjorn
        return 42069;
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

export function createGame(puzzle: Puzzle, logger: pino.Logger) {
    return new GameImpl(puzzle, logger);
};
