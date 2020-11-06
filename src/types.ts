import * as net from "net";
import { EventEmitter } from "events";

import { Stats } from "./score";

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
}

export interface Game extends EventEmitter {
    gameHasEnoughPlayers(): boolean;
    addPlayer(conn: net.Socket): Promise<void>;
};


