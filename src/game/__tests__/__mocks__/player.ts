/*
export class MockPlayer {

    public callbacks: {[key: string]: Callback};

    constructor(public conn: any, public logger: any) { }

    on(type: string, cb: Callback){
        this.callbacks[type] = cb;
    }

    send(to: string, type: string, msg: string) {
        this.callbacks[to](type, msg);
    }
};

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
