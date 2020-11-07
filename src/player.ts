import * as net from "net";
import pino from "pino";

import HandleMsg, { createMessage } from "./handle-messages";
import { Stats } from "./score";
import { Logger, getNewId } from "./logger";
import { EventEmitter } from "events";
import { Player, PlayerObject } from "./types";

type AwaitCommmands = {
    res: (arg: [string, string]) => void,
    rej: (e: Error) => void,
    type: string
}

export class PlayerImpl extends EventEmitter implements Player {
    private parser: HandleMsg;
    public id: number;
    public conn: net.Socket;
    public ready: boolean = false;
    public finished: boolean = false;
    public started: boolean = false;
    public timedout: boolean = false;
    public failed: boolean = false;
    public disconnected: boolean = false;
    public stats: Stats;
    public failureMessage: string | null;

    private logger: pino.Logger;
    private awaitingCommands: AwaitCommmands[];

    constructor(conn: net.Socket, logger: pino.Logger) {
        super();
        this.stats = new Stats();
        this.conn = conn;
        this.parser =  new HandleMsg();
        this.failureMessage = null;
        this.logger = logger.child({ name: "Player" });
        this.awaitingCommands = [];

        conn.on("data", (d) => {
            const {
                completed,
                type,
                message
            } = this.parser.parse(d.toString());

            if (completed) {
                this.logger.info("conn#data", {
                    id: this.id,
                    type,
                    message,
                });
                this.emit("msg", type, message);

                for (let i = this.awaitingCommands.length - 1; i >= 0; --i) {
                    if (this.awaitingCommands[i].type === type) {
                        const cmd = this.awaitingCommands.splice(i, 1)[0];
                        cmd.res([type, message]);
                    }
                }
            }
        });

        conn.on("end", () => {
            this.logger.info("conn#end", {id: this.id});
            this.emit("end");
        });
    }

    // I like this,
    // but I am not going to do it yet...
    send(typeOrMsg: string, message?: string | object): Promise<void> {
        const messageId = getNewId();
        const msg = message ? createMessage(typeOrMsg, message) : typeOrMsg;

        this.logger.info("send", {messageId, msg});

        return new Promise((res, rej) => {
            if (this.conn.destroyed || this.disconnected) {
                const item = {
                    reason: "Could not send message",
                    msg,
                    messageId,
                    destroyed: this.conn.destroyed,
                };
                this.emit("send-failed", item);
                this.logger.warn("send-failed", item);

                return;
            }

            this.conn.write(msg, (e) => {
                if (e) {
                    this.logger.warn("send#response#error", {error: e});
                    rej(e);
                    return;
                }
                this.logger.warn("send#response success");
                res();
            });
        })
    }

    toObj() {
        return {
            id: this.id,
            ready: this.ready,
            finished: this.finished,
            started: this.started,
            failed: this.failed,
            timedout: this.timedout,
            disconnected: this.disconnected,
            stats: this.stats,
        };
    }

    getNextCommand(type: string): Promise<[string, string]> {
        let res: (arg: [string, string]) => void;
        let rej: (e: Error) => void;

        const out: Promise<[string, string]> = new Promise((r, e) => {
            res = r;
            rej = e;
        });

        this.awaitingCommands.push({res, rej, type});

        return out;
    }
}

export function createPlayer(conn: net.Socket, logger: pino.Logger): Player {
    return new PlayerImpl(conn, logger);
};
