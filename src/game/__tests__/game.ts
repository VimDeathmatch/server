import { setNextPromise } from "./__mocks__/player-join";
import MockSocket from "./__helpers__/mock-socket";
import { createGame } from "../";
import { Game } from "../../types";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

describe("Game", function() {
    function createTestGame(start = [""], end = [""], filetype = "javascript"): Game {
        return createGame({start, end, filetype});
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

