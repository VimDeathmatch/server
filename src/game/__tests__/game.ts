import pino from "pino";

import { setNextPromise } from "./__mocks__/player-join";
import MockSocket from "./__helpers__/mock-socket";

// TODO: How to figure this out.  I don't want to have to specify the index
import { createGame } from "../index";

import { Game } from "../../types";

const logger = pino({ name: "__tests__/game"});

describe("Game", function() {
    function createTestGame(start = [""], end = [""], filetype = "javascript"): Game {
        return createGame({start, end, filetype}, logger);
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
    });
});

