import {
    setReturnTime
} from "__mocks__/now";

import {
    Player,
} from "src/types";

import {
    PlayerStats
} from "game/score";

export default function createEndgame(
    p1: Player, p2: Player, timeToWin: number = 1,
    keys1 = ["a", "b", "c"], keys2 = ["a", "b", "c"]) {

    const p1Stats = new PlayerStats(JSON.stringify({
        undoCount: 0,
        keys: keys1,
    }));
    const p2Stats = new PlayerStats(JSON.stringify({
        undoCount: 0,
        keys: keys2,
    }));

    p1.stats.start();
    p2.stats.start();

    setReturnTime(0);
    p1.stats.calculateScore(p1Stats);
    setReturnTime(timeToWin);
    p2.stats.calculateScore(p2Stats);

    p1.finished = true;
    p2.finished = true;
}

