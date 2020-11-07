import * as net from "net"

import {
    createMessage,
} from "./networking/handle-messages"

const maxRTTS = 5;
const RETEST_TIME_INTERVAL = 20000;

function avg(arr: number[]): number {
    return arr.reduce((acc, x) => acc + x, 0) / arr.length;
}

export class ConnectionDetails {
    private closed: boolean;
    private count = 0;
    private then = 0;
    private rtts: number[];

    public lagMS: number;

    constructor(private conn: net.Socket) {
        this.closed = true;
        this.lagMS = 0;
        this.rtts = [];
        this.testConnection();
    }

    public close() {
        this.closed = true;
    }

    public receivePong() {
        this.rtts.push((Date.now() - this.then) / 2);
        if (this.rtts.length > maxRTTS) {
            this.rtts.shift();
        }

        this.lagMS = avg(this.rtts);

        if (this.rtts.length === maxRTTS) {
            setTimeout(() => this.testConnection(), RETEST_TIME_INTERVAL);
        } else {
            this.testConnection();
        }
    }

    private testConnection() {
        if (this.conn.destroyed || this.closed) {
            this.closed = true;
            return;
        }

        this.then = Date.now();
        this.conn.write(createMessage("ping", ""));
    }
}


