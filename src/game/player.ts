import * as net from "net";

import pino from "pino";

import HandleMsg, { createMessage } from "../networking/handle-messages";
import { Stats } from "./score";
import { EventEmitter } from "events";
import { AwaitCommmands, Player } from "../types";

export class PlayerImpl extends EventEmitter implements Player {
    private parser: HandleMsg;
    public id: number;
    public conn: net.Socket;
    public ready: boolean = false;
    public finished: boolean = false;
    public started: boolean = false;
    private _timedout: boolean = false;

    get timedout(): boolean {
        return this._timedout;
    }
    set timedout(v: boolean) {
        this._timedout = v;
        if (this._timedout) {
            this.logger.info("Player has timedout");
            this.emit("end");
        }
    }

    private _failed: boolean = false;
    get failed(): boolean {
        return this._failed;
    }
    set failed(v: boolean) {
        this._failed = v;
        if (this._failed) {
            this.logger.info("Player has failed");
            this.emit("end");
        }
    }

    public disconnected: boolean = false;
    public stats: Stats;
    public failureMessage: string | null;

    private logger: pino.Logger;
    private awaitingCommands: AwaitCommmands[];

    constructor(conn: net.Socket, logger: pino.Logger) {
        super();
        this.logger = logger.child({ name: "Player" });
        this.stats = new Stats(this.logger);
        this.conn = conn;
        this.parser = new HandleMsg(logger);
        this.failureMessage = null;
        this.awaitingCommands = [];

        conn.on("data", (d) => {
            this.logger.info({data: d.toString()}, "Data Received");
            const {
                completed,
                type,
                message
            } = this.parser.parse(d.toString());

            if (completed) {
                this.logger.info({
                    id: this.id,
                    type,
                    message,
                }, "conn#data");

                console.log("PLAYRE EMITS");
                this.emit("msg", type, message);
                console.log("PLAYRE EMITS");

                for (let i = this.awaitingCommands.length - 1; i >= 0; --i) {
                    if (this.awaitingCommands[i].type === type) {
                        const cmd = this.awaitingCommands.splice(i, 1)[0];
                        cmd.res([type, message]);
                    }
                }
            }
        });

        conn.on("end", () => {
            this.logger.info({id: this.id}, "conn#end");
            this.disconnected = true;
            this.emit("end");
        });
    }

    // I like this,
    // but I am not going to do it yet...
    send(typeOrMsg: string, message?: string | object): Promise<void> {
        let msg = message !== undefined ? createMessage(typeOrMsg, message) : typeOrMsg;

        this.logger.info({msg}, "send");

        return new Promise((res, rej) => {
            if (this.conn.destroyed || this.disconnected) {
                const item = {
                    reason: "Could not send message",
                    msg,
                    destroyed: this.conn.destroyed,
                };
                this.emit("send-failed", item);
                this.logger.warn(item, "send-failed");

                rej(item);
                return;
            }

            this.conn.write(msg, (e) => {
                if (e) {
                    this.logger.warn({error: e}, "send#response#error");
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

    disconnect() {
        if (!this.disconnected) {
            this.conn.end();
            this.conn.destroy();
            this.disconnected = true;
            this.emit("end");
        }
    }
}

export function createPlayer(conn: net.Socket, logger: pino.Logger): Player {
    return new PlayerImpl(conn, logger);
};
