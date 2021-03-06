import * as net from "net";
import pino from "pino";
import { EventEmitter } from "events";

import { Stats } from "./game/score";

// TODO: Why does this require index....
import { Puzzle } from "./puzzles/index";

export type ServerOptions = {
    maxPlayers: number;
    maxPlayTime: number;
    maxReadyTime: number;
};

export type DisplayMessage = {
    left: string[];
    right?: string[];
    editable?: boolean;
};

export type WinningMessage = {
    failed: boolean;
    winner: boolean;
    expired: boolean;
    scoreDifference: number;
    keysPressedDifference: number;
    timeDifference: number;
};

export interface BehavorialNode {
    enter(): Promise<void>;
    shouldEnter(players: Player[]): Promise<boolean>;
    run(players: Player[]): Promise<boolean>;
    exit(): Promise<void>;
}

export type PlayerObject = {
    id: number,
    ready: boolean,
    finished: boolean,
    started: boolean,
    failed: boolean,
    timedout: boolean,
    disconnected: boolean,
    stats: Stats,
}

export type AwaitCommmands = {
    res: (arg: [string, string]) => void,
    rej: (e: Error) => void,
    type: string
}

export interface Player extends EventEmitter {
    id: number;
    conn: net.Socket;
    ready: boolean;
    finished: boolean;
    started: boolean;
    timedout: boolean;
    failed: boolean;
    disconnected: boolean;
    stats: Stats;
    failureMessage: string | null;

    send(typeOrMsg: string, message?: string | object): Promise<void>;
    toObj(): PlayerObject;
    getNextCommand(msgType: string): Promise<[string, string]>;
    disconnect(): void;
}

// TODO: What is the name of this thing?
export type GameConfig = {
    maxReadyTime: number;
    maxPlayers: number;
    puzzle: Puzzle;
    maxPlayTime: number;
    logger: pino.Logger;
}

export interface Game extends EventEmitter {
    getConfig(): GameConfig;
    needsPlayers(): boolean;
    addPlayer(conn: net.Socket): Promise<void>;
    getPuzzle(): Puzzle;
    getLogger(): pino.Logger;
    getMaxPlayTime(): number;
    isFinished(): boolean;
};


