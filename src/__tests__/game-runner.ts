import * as net from "net";

let isFinished = false;
let needsPlayers = true;
let currentGame = null;
jest.mock("game/index", function() {
    return {
        createGame(config: GameConfig, tree: BehavorialNode) {
            currentGame = {
                needsPlayers() { return needsPlayers; },
                addPlayer: jest.fn(),
                isFinished() {
                    return isFinished;
                }
            };

            return currentGame;
        },
    };
});

import GameRunner from "../game-runner";
import { GameConfig, BehavorialNode } from "src/types";

describe("Game Runner", function() {
    beforeEach(function() {
        isFinished = false;
        needsPlayers = true;
        currentGame = null;
    });

    it("add two players, no problems", function() {
        const runner = new GameRunner();
        runner.addPlayer({} as any as net.Socket);
        expect(currentGame).not.toBeNull();
        runner.addPlayer({} as any as net.Socket);
        expect(currentGame.addPlayer).toBeCalledTimes(2);
    });

    it("done is true, therefore second player should get put into new game.", function() {
        const runner = new GameRunner();
        runner.addPlayer({} as any as net.Socket);
        isFinished = true;
        let g = currentGame;
        expect(currentGame).not.toBeNull();
        runner.addPlayer({} as any as net.Socket);
        expect(currentGame.addPlayer).toBeCalledTimes(1);
        expect(g).not.toEqual(currentGame);
    });

    it("needsPlayers is true, therefore second player should get put into new game.", function() {
        const runner = new GameRunner();
        runner.addPlayer({} as any as net.Socket);
        needsPlayers = false;
        expect(currentGame).not.toBeNull();
        let g = currentGame;
        runner.addPlayer({} as any as net.Socket);
        expect(currentGame.addPlayer).toBeCalledTimes(1);
        expect(g).not.toEqual(currentGame);
    });
});


