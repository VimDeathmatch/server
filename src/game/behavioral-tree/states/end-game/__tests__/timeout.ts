import pino from "pino";

// I just need it to be mocked
import * as __now from "__mocks__/now";

import TimedoutNode from "../timedout";

import {
    getOpponentTimedoutMessage,
    getTimeoutMessage,
    getBothTimedout,
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

describe("Timeout", function() {
    it("should produce opponent timed out message", async function() {
        const timedout = spyOn(new TimedoutNode(config));
        const [ p1, s1 ] = createPlayer(logger);
        const [ p2, s2 ] = createPlayer(logger);

        const players = [p1, p2];
        p2.timedout = true;

        expect(await timedout.shouldEnter(players)).toEqual(true);

        await timedout.enter();
        await timedout.run(players);

        expect(s1.writes[0]).toContain(getOpponentTimedoutMessage()[0]);
        expect(s2.writes[0]).toContain(getTimeoutMessage()[0]);
    });

    it("should produce opponent timed out message", async function() {
        const timedout = spyOn(new TimedoutNode(config));
        const [ p1, s1 ] = createPlayer(logger);
        const [ p2, s2 ] = createPlayer(logger);

        const players = [p1, p2];
        p1.timedout = true;
        p2.timedout = true;

        expect(await timedout.shouldEnter(players)).toEqual(true);

        await timedout.enter();
        await timedout.run(players);

        expect(s1.writes[0]).toContain(getBothTimedout()[0]);
        expect(s2.writes[0]).toContain(getBothTimedout()[0]);
    });
});




