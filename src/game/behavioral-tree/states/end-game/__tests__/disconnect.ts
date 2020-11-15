import pino from "pino";

// I just need it to be mocked
import * as __now from "__mocks__/now";

import {
    DisconnectedNode,
} from "../disconnected";

import {
    getDisconnectedMessage,
    getOpponentDisconnectedMessage,
} from "../finish-message";

import {
    createPlayer,
} from "src/__helpers__/createPlayer";
import {
    spyOn,
} from "__mocks__/bnode";

const logger = pino({name: "DisconnectedNode__tests__"});

// @ts-ignore
const config = { logger, } as GameConfig;

describe("Disconnected", function() {
    it("should produce opponent disconnected message", async function() {
        const disconnected = spyOn(new DisconnectedNode(config));
        const [ p1, s1 ] = createPlayer(logger);
        const [ p2, s2 ] = createPlayer(logger);

        const players = [p1, p2];
        p2.disconnected = true;

        expect(await disconnected.shouldEnter(players)).toEqual(true);

        await disconnected.enter();
        await disconnected.run(players);

        expect(s1.writes[0]).toContain(getOpponentDisconnectedMessage()[0]);
        expect(s2.writes.length).toEqual(0);
    });
});






