import padMessage from "../../../utils/padMessage"

import {
    Player,
    WinningMessage,
    DisplayMessage,
} from "src/types";

import {
    getFinishedMessage,
    winnerMessage,
    loserMessage,
    pointMessage,
    getKeypressDifferenceMessage,
    getTimeDifferenceMessage,
} from "./finish-message";


// TODO: Tie? can this happen?
export function getWinnerAndLoser(p1: Player, p2: Player): [Player, Player] {
    if (p1.stats.score > p2.stats.score) {
        return [p1, p2];
    }
    return [p2, p1];
}

export function displayEndGameMessage(msg: WinningMessage): DisplayMessage {
    const out: string[] = [];

    if (msg.winner) {
        out[0] = winnerMessage();
    }
    else if (!msg.winner) {
        out[0] = loserMessage();
    }

    out.push("");
    out.push(pointMessage(msg.winner, msg.scoreDifference));
    out.push(getKeypressDifferenceMessage(msg.keysPressedDifference));
    out.push(getTimeDifferenceMessage(msg.timeDifference));

    return {
        left: padMessage(out),
        editable: false
    };
}

