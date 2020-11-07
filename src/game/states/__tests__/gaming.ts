import pino from "pino";

import gaming from "../gaming";
import MockPlayer from "../../../__mocks__/player";
import { Player } from "../../../types";

const config = {
    logger: pino({ name: "test__gaming" }),
    puzzle: {
        start: [""],
        end: [""],
        filetype: "ts",
    },
    maxPlayTime: 30000,
}

describe("play game state", function() {
    it("ensures a successful play through the game.", function() {
        const player = new MockPlayer();
        gaming(config, [player]);
    });
});

