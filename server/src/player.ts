import * as net from "net";

import { EventEmitter } from "events";
import HandleMsg, { createMessage } from "./handle-messages";
import { Stats } from "./score";
import { Logger, getNewId } from "./logger";

export class Player extends EventEmitter {
    public id: number;
    public conn: net.Socket;
    public ready: boolean = false;
    public finished: boolean = false;
    public started: boolean = false;
    public timedout: boolean = false;
    public failed: boolean = false;
    public disconnected: boolean = false;
    public timerId: ReturnType<typeof setTimeout>;
    public stats: Stats;
    public failureMessage: string | null;

    private logger: Logger;

    constructor(conn: net.Socket, public parser: HandleMsg, logger?: Logger) {
        super();
        this.stats = new Stats();
        this.conn = conn;
        this.failureMessage = null;
        this.logger = logger && logger.child(() => [], "Player") ||
            new Logger(() => [this.id], { className: "Player" });
    }

    // I like this,
    // but I am not going to do it yet...
    send(typeOrMsg: string, message?: string | object): Promise<void> {
        const messageId = getNewId();
        const msg = message ? createMessage(typeOrMsg, message) : typeOrMsg;

        this.logger.info("send", messageId, msg);

        return new Promise((res, rej) => {
            if (this.conn.destroyed || this.disconnected) {
                this.emit("send-failed", {
                    reason: "Could not send message",
                    msg,
                    messageId,
                    destroyed: this.conn.destroyed,
                });
                return;
            }

            this.conn.write(msg, (e) => {
                this.logger.info("send#response", e);
                if (e) {
                    rej(e);
                    return;
                }
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
}



