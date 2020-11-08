import pino from "pino";

import MockSocket, { trashSocket, readySocket } from "../../../../__mocks__/socket";

import { createPlayer } from "../../../player";
import PlayerJoinNode, { playerJoin } from "../player-join-node";

const logger = pino({name: "playerJoin.test"});
function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

describe("PlayerJoinNode", function() {
    it("ensure that 1 player can join the game.", async function() {
        const socket = new MockSocket();
        const player = createPlayer(socket as any, logger);
        const pjn = new PlayerJoinNode({
            logger,
            maxPlayers: 1
        } as any);

        expect(await pjn.shouldEnter([player])).toEqual(true);
        await pjn.run([player]);
        await readySocket(socket);

        expect(await pjn.shouldEnter([player])).toEqual(false);
        expect(player.ready).toEqual(true);
    });
});


describe("playerJoin", function() {

    it("should finish when the player sends ready command.", async function() {
        const socket = new MockSocket();
        const player = createPlayer(socket as any, logger);

        const playerJoining = playerJoin(player);
        readySocket(socket);
        expect(await playerJoining).toEqual("just a tird, Mr AltFYeah");
    });

    it("should throw an error on any other kind of message.", async function() {
        const socket = new MockSocket();
        const player = createPlayer(socket as any, logger);

        const playerJoining = playerJoin(player);
        trashSocket(socket);
        expect(playerJoining).rejects.toEqual(
            new Error("Unexpected message type when player joining"));
    });
});
