import { createMessage } from "../networking/handle-messages";

export type Callback = (...args: any) => Promise<void>;
export type FilterCallback = (data: any) => boolean;

const trashMessage = createMessage("trash", "messsage");
const readyMessage = createMessage("ready", "just a tird, Mr AltFYeah");

export async function readySocket(socket: MockSocket) {
    await socket.callbacks["data"](readyMessage);
}

export async function trashSocket(socket: MockSocket) {
    await socket.callbacks["data"](trashMessage);
}

export async function sendSocketMessage(socket: MockSocket, type: string, msg: string | object) {
    await socket.callbacks["data"](createMessage(type, msg));
}

export default class MockSocket {
    public callbacks: {[key: string]: Callback} = {};
    public writes: any[] = [];
    public ended: boolean = false;

    private filter: FilterCallback;

    addCallbackFilter(cb: FilterCallback) {
        this.filter = cb;
    }

    on(key: string, cb: Callback) {
        this.callbacks[key] = cb;
    }

    write(data: any, cb?: (e?: Error) => void) {
        if (this.ended) {
            throw new Error("NO CALLING ME");
        }

        this.writes.push(data);

        // Probably have to mock this out
        if (cb && (!this.filter || this.filter(data))) {
            cb();
        }
    }

    end() {
        this.ended = true;
        if (this.callbacks.end) {
            this.callbacks.end();
        }
    }
}


