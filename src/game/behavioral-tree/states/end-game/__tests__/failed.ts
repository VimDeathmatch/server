import pino from "pino";

// I just need it to be mocked
import * as __now from "__mocks__/now";

import {
    FailedNode,
} from "../failed";

import {
    getFailedMessage,
    getOpponentFailedMessage,
} from "../finish-message";

import {
    createPlayer,
} from "src/__helpers__/createPlayer";
import {
    spyOn,
} from "__mocks__/bnode";

const logger = pino({name: "SuccessfulNode__tests__"});

// @ts-ignore
const config = { logger, } as GameConfig;

describe("Failed", function() {
    it("should produce opponent failed message", async function() {
        const timedout = spyOn(new FailedNode(config));
        const [ p1, s1 ] = createPlayer(logger);
        const [ p2, s2 ] = createPlayer(logger);

        const players = [p1, p2];
        p2.failed = true;

        expect(await timedout.shouldEnter(players)).toEqual(true);

        await timedout.enter();
        await timedout.run(players);

        expect(s1.writes[0]).toContain(getOpponentFailedMessage()[0]);
        expect(s2.writes[0]).toContain(getFailedMessage()[0]);
    });
});





