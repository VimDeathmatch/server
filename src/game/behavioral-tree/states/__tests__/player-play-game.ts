import pino from "pino";

import MockSocket, { trashSocket, readySocket, sendSocketMessage } from "../../../../__mocks__/socket";
import { runPendingPromises } from "../../../../__mocks__/promise";

import { createPlayer } from "../../../player";
import PlayGameNode, { playGame } from "../player-play-game";
import { GameConfig, Player } from "../../../../types";

const logger = pino({name: "PlayGameNode.test"});
function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

function createGameConfig(arg: object = {}): GameConfig {
    return {
        logger,
        maxPlayers: 1,
        maxPlayTime: 42069,
        puzzle: {
            start: [],
            end: [],
            filetype: "ts",
        },
        ...arg
    };
}

function createState(arg: object = {}): {[keys: string]: boolean} {
    return {
        timedout: false,
        failed: false,
        disconnected: false,
        finished: false,
        ...arg
    };
}

function assignToPlayer(player: Player, arg: {[keys: string]: boolean}) {
    Object.keys(arg).forEach(k => {
        player[k] = arg[k];
    });
}

describe("PlayGameNode", function() {
    it("tests all the conditions for player shouldEnter", async function() {
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);
        const pgn = new PlayGameNode(createGameConfig());
        const states = [
            createState({timedout: true}),
            createState({failed: true}),
            createState({disconnected: true}),
            createState({finished: true}),
            createState(),
        ];

        const shouldEnterExpects = [false, false, false, false, true];
        for (let i = 0; i < states.length; ++i) {
            assignToPlayer(player, states[i]);
            expect(await pgn.shouldEnter([player])).toEqual(shouldEnterExpects[i]);
        }
    });

    it("Ensures run only runs once.", async function() {
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);
        const pgn = new PlayGameNode(createGameConfig());
        jest.spyOn(player, "send");

        expect(await pgn.shouldEnter([player])).toEqual(true);
        await pgn.run([player]);
        expect(player.send).toHaveBeenCalledTimes(1);

        expect(await pgn.shouldEnter([player])).toEqual(true);
        await pgn.run([player]);
        expect(player.send).toHaveBeenCalledTimes(1);
    });
});

describe("playGame", function() {
    jest.useFakeTimers();

    //export async function playGame(config: GameConfig, player: Player, logger: pino.Logger): Promise<void> {
    it("should timeout", async function() {
        const config = createGameConfig({ });
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);

        jest.spyOn(player, "send");
        const pgn = new PlayGameNode(createGameConfig());
        await pgn.shouldEnter([player]);
        await pgn.run([player]);

        expect(player.send).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(config.maxPlayTime - 100);
        expect(player.send).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);
        await runPendingPromises();

        expect(player.timedout).toEqual(true);
    });

    it("should cause player failure due to stats format.", async function() {
        const config = createGameConfig({ });
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);

        jest.spyOn(player, "send");
        const pgn = new PlayGameNode(createGameConfig());
        await pgn.shouldEnter([player]);
        await pgn.run([player]);

        expect(player.send).toHaveBeenCalledTimes(1);
        await sendSocketMessage(socket, "finished", "{}");
        await runPendingPromises();

        expect(player.failed).toEqual(true);
    });

    it("should cause player failure due to stats format.", async function() {
        const config = createGameConfig({ });
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);

        jest.spyOn(player, "send");
        const pgn = new PlayGameNode(createGameConfig());
        await pgn.shouldEnter([player]);
        await pgn.run([player]);

        expect(player.send).toHaveBeenCalledTimes(1);
        await sendSocketMessage(socket, "finished", "{}");
        await runPendingPromises();

        expect(player.failed).toEqual(true);
    });

    it("should successfully complete a game.", async function() {
        const config = createGameConfig({ });
        const socket = new MockSocket();
        let player = createPlayer(socket as any, logger);

        jest.spyOn(player, "send");
        const pgn = new PlayGameNode(createGameConfig());
        await pgn.shouldEnter([player]);
        await pgn.run([player]);

        expect(player.send).toHaveBeenCalledTimes(1);
        await sendSocketMessage(socket, "finished", {keys: ["a", "b", "c"], undoCount: 0});
        await runPendingPromises();

        expect(player.finished).toEqual(true);
    });
});
