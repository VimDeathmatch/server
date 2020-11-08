// TODO(v1): test to many players
// TODO(v1): waitForPlayers

import pino from "pino";

import MockSocket, { trashSocket, sendSocketMessage } from "../../__mocks__/socket";

// TODO: How to figure this out.  I don't want to have to specify the index
import { createGame } from "../index";
import SequenceNode from "../behavioral-tree/sequence";
import {
    spyOn,
    TurnOnNode,
} from "../../__mocks__/bnode";
import { Game, BehavorialNode, Player } from "../../types";

const logger = pino({ name: "__tests__/game"});
const puzzle = {
    start: [],
    end: [],
    filetype: "c++",
};

describe("Game", function() {
    function createNewGame(tree: BehavorialNode): Game {
        return createGame({
            logger,
            puzzle,
            maxPlayTime: 42069,
            maxPlayers: 2,
        }, tree);
    }

    it("Game should be able to add a player and transition on msg or ending.", async function() {
        const n0 = spyOn<TurnOnNode>(new TurnOnNode());
        const n1 = spyOn<TurnOnNode>(new TurnOnNode());
        const n2 = spyOn<TurnOnNode>(new TurnOnNode());
        const game = createNewGame(new SequenceNode([
            n0,
            n1,
            n2,
        ]));

        const p1 = new MockSocket();
        n0.setShouldEnter(true);

        await game.addPlayer(p1 as any);

        expect(n0.shouldEnter).toBeCalledTimes(1);
        expect(n0.enter).toBeCalledTimes(1);
        expect(n0.run).toBeCalledTimes(1);
        expect(n1.shouldEnter).toBeCalledTimes(0);

        await trashSocket(p1);

        expect(n0.shouldEnter).toBeCalledTimes(2);
        expect(n0.enter).toBeCalledTimes(1);
        expect(n0.run).toBeCalledTimes(2);
        expect(n1.shouldEnter).toBeCalledTimes(0);
    });
});

/*
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
            maxPlayers: 2,
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

*/
