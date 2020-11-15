import padMessage from "../../../utils/padMessage"

import {
    Player,
    WinningMessage,
    DisplayMessage,
} from "src/types";

import {
    winnerMessage,
    loserMessage,
    pointMessage,
    getKeypressDifferenceMessage,
    getTimeDifferenceMessage,
    getTimeoutMessage,
    getBothTimedout,
    getOpponentTimedoutMessage,
    getFailedMessage,
    getOpponentFailedMessage,
    getDisconnectedMessage,
    getOpponentDisconnectedMessage,
} from "./finish-message";


// TODO: Tie? can this happen?
export function getWinnerAndLoser(p1: Player, p2: Player): [Player, Player] {
    if (p1.stats.score > p2.stats.score) {
        return [p1, p2];
    }
    return [p2, p1];
}

export function disconnectedMessage(p: Player): DisplayMessage {
    let out: string[];
    //
    // If P has failed, we send no message
    if (p.disconnected) {
        out = getDisconnectedMessage();
    }
    else {
        out = getOpponentDisconnectedMessage();
    }

    return {
        left: padMessage(out),
        editable: false
    };
}

export function failedMessage(p: Player): DisplayMessage {
    let out: string[];
    //
    // If P has failed, we send no message
    if (p.failed) {
        out = getFailedMessage();
    }
    else {
        out = getOpponentFailedMessage();
    }

    return {
        left: padMessage(out),
        editable: false
    };
}

export function timeoutMessage(p: Player, other: Player): DisplayMessage {
    let out: string[];
    if (p.timedout && other.timedout) {
        out = getBothTimedout();
    }
    else if (p.timedout) {
        out = getTimeoutMessage();
    }
    else {
        out = getOpponentTimedoutMessage();
    }

    return {
        left: padMessage(out),
        editable: false
    };
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

