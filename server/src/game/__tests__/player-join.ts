import * as pino from "pino";

import MockSocket from "./__helpers__/mock-socket";

import { createPlayer } from "../../player";
import { createMessage } from "../../handle-messages";
import { playerJoin } from "../player-join";

const logger = pino({name: "playerJoin.test"});

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

describe("playerJoin", function() {

    it("should finish when the player sends ready command.", async function() {
        const socket = new MockSocket();
        const player = createPlayer(socket as any, logger);
        const msg = createMessage("ready", "just a tird, Mr AltFYeah");

        const playerJoining = playerJoin(player);
        await wait(16);
        socket.write(msg);

        expect(playerJoining).resolves.toEqual("just a tird, Mr AltFYeah");
    });

    it("should throw an error on any other kind of message.", async function() {
        const socket = new MockSocket();
        const player = createPlayer(socket as any, logger);
        const msg = createMessage("foo", "just a tird, Mr AltFYeah");

        const playerJoining = playerJoin(player);
        await wait(16);
        socket.write(msg);

        expect(playerJoining).rejects.toThrow();
    });
});
