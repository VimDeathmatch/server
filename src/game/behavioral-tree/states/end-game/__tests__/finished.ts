// sys

// 3rd
import pino from "pino";

// I just need it to be mocked
import * as __now from "__mocks__/now";
import createEndgame from "src/__helpers__/createEndgame";

import SuccessfulFinish from "../finished";
import {
    loserMessage,
    winnerMessage,
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

describe("SuccessfulFinish", function() {
    it("should emit successful messages to the users.", async function() {
        const success = spyOn(new SuccessfulFinish(config));
        const [ p1, s1 ] = createPlayer(logger);
        const [ p2, s2 ] = createPlayer(logger);

        const players = [p1, p2];

        createEndgame(p1, p2);

        expect(await success.shouldEnter(players)).toEqual(true);
        await success.enter();
        await success.run(players);

        expect(s1.writes[0]).toContain(winnerMessage());
        expect(s2.writes[0]).toContain(loserMessage());
    });
});

