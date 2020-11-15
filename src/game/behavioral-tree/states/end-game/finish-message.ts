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

export function winnerMessage(): string {
    return "  You are the winner!!!";
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
