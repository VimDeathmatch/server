// TODO(v1): test to many players
// TODO(v1): waitForPlayers

import pino from "pino";

import { WaitingForPlayersMsg } from "../waiting-for-players";
import { setNextPromise } from "../../__mocks__/player-join";
import MockSocket from "../../__mocks__/socket";

// TODO: How to figure this out.  I don't want to have to specify the index
import { createGame } from "../index";

import { Game } from "../../types";

const logger = pino({ name: "__tests__/game"});

function hasWaitingForPlayers(socket: MockSocket) {
    return socket.writes.reduce((acc, msg: string) => {
        return acc || msg.indexOf(WaitingForPlayersMsg) !== -1;
    }, false);
}

describe("Game", function() {
    function createTestGame(start = [""], end = [""], filetype = "javascript"): Game {
        return createGame({
            logger,
            puzzle: {start, end, filetype},
            maxPlayTime: 30000,
        });
    }

    it("A player should be able to join", async function() {
        const p1 = new MockSocket();
        const p2 = new MockSocket();
        const game = createTestGame();

        setNextPromise(new Promise(res => res()));

        await game.addPlayer(p1 as any);
        expect(game.gameHasEnoughPlayers()).toEqual(false);

        setNextPromise(new Promise(res => res()));
        await game.addPlayer(p2 as any);

        expect(game.gameHasEnoughPlayers()).toEqual(true);
        expect(hasWaitingForPlayers(p1)).toEqual(true);
        expect(hasWaitingForPlayers(p2)).toEqual(true);
    });
});

