import {
    WinningMessage,
} from "src/types";

export function getFinishedMessage(): WinningMessage {
    return {
        failed: false,
        winner: true,
        expired: false,
        scoreDifference: 0,
        keysPressedDifference: 0,
        timeDifference: 0,
    };
}

// TODO(v2): When the player joins, they should upload their window dimenions.
// That way I can format the messaging automagically for them.
export function getTimeoutMessage(): string[] {
    return [
        "  You were incapable of finishing the most basic of tasks",
        "  Therefore you have run out of time.  Get better ked.",
    ];
}

// 1.  "The spirits of your ancestors will never forget that you failed to even appear to the fight." - judopandapants
// 2.
// 3.  "You just tied. That's definitely worse than losing with honor. Get better!" - asbjornHaland
// 4.                          get gud ked - Ghandi
// 5.  The stars have aligned, you both lost - dv_656
// TODO(v2): Random messages for funnsies.
export function getBothTimedout(): string[] {
    return [
        "You have both disappointed me in ways I never thought you could - all dubs",
        "                                     You and your opponent both timed out.",
    ];
}

export function getOpponentTimedoutMessage(): string[] {
    return [
        "  Your enemy was incapable of finishing the task at hand and timedout",
        "  Unfortunately you won by default, congrats-ish.",
    ];
}

export function getFailedMessage(): string[] {
    return ["Server Error"];
}

export function getOpponentFailedMessage(): string[] {
    return [
        "  Your enemy errored out.  I don't know what to say.",
        "  I think you won because you didn't error, but is that even a win?",
    ];
}

export function winnerMessage(): string {
    return "  You are the incredible winner!!!";
}

export function loserMessage(): string {
    return "  You are an incredible loser!!!";
}

export function pointMessage(winner: boolean, scoreDifference: number): string {
    return `you ${winner ? "won" : "lost"} by ${Math.abs(scoreDifference)} points.`;
}

export function getKeypressDifferenceMessage(keysPressed: number): string {
    if (keysPressed === 0) {
        return `you have pressed the same amount keys.`;
    }
    return `You have pressed ${Math.abs(keysPressed)} ${keysPressed > 0 ? "more" : "less"} keys than your enemy.`;
}

export function getTimeDifferenceMessage(timeDifference: number): string {
    return `you were ${timeDifference < 0 ? "faster" : "slower"} by ${Math.abs(timeDifference)} milliseconds.`;
}
