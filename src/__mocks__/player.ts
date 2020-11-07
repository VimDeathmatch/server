import * as net from "net";
import { EventEmitter } from "events";

import { AwaitCommmands, Player, PlayerObject } from "../types";
import { PlayerImpl } from "../player";
import { Stats } from "../score";

export default class MockPlayer extends EventEmitter implements Player {
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

    sentMessages: [string, string | object][];
    awaitingCommands: AwaitCommmands[];

    constructor() {
        super();
        this.sentMessages = [];
        this.awaitingCommands = [];
    }

    getMessage(type: string): [string, string | object] | null {
        let cmd: [string, string | object] | null = null;
        for (let i = this.sentMessages.length - 1; i >= 0; --i) {
            if (this.sentMessages[i][0] === type) {
                cmd = this.sentMessages.splice(i, 1)[0];
            }
        }

        return cmd;
    }

    send(typeOrMsg: string, message: string | object): Promise<void> {
        this.sentMessages.push([typeOrMsg, message]);
        return Promise.resolve();
    }

    toObj(): PlayerObject {
        return {
            ...this
        };
    }

    getNextCommand(msgType: string): Promise<[string, string]> {
        return PlayerImpl.prototype.getNextCommand.call(this, msgType);
    }
};

/*
let currentPlayer: MockPlayer;

export function getLastMocked() {
    return currentPlayer;
}

jest.mock('../player', () => {
    createPlayer: jest.fn().mockImplementation((conn, logger) => {
        currentPlayer = new MockPlayer(conn, logger);
        return currentPlayer as any;
    });
});
*/
