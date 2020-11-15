import pino from "pino";
import {
    setReturnTime
} from "__mocks__/now";

import createEndgame from "__helpers__/createEndgame";

import {
    createPlayer,
} from "__helpers__/createPlayer";

import {
    Player
} from "src/types";
import {
    PlayerStats
} from "game/score";

import {
    getWinnerAndLoser,
} from "../utils";

const logger = pino({name: "GameUtils__tests__"});
describe("GameUtils", function() {

    it("should be able to select the winner", function() {
        const p1: Player = createPlayer(logger)[0];
        const p2: Player = createPlayer(logger)[0];

        createEndgame(p1, p2);
        const [winner, loser] = getWinnerAndLoser(p1, p2);

        expect(winner).toBe(p1);
        expect(loser).toBe(p2);
    });
});
