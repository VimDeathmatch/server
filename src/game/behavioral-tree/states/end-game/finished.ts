import {
    Player,
    GameConfig,
    WinningMessage,
    BehavorialNode,
} from "../../../../types";

import {
    getWinnerAndLoser,
    displayEndGameMessage,
} from "./utils";

import {
    getFinishedMessage,
} from "./finish-message";

import {
    runAndReportFailure,
} from "./runAndReportError";

export default class SuccessfulEnding1v1 implements BehavorialNode {
    constructor(private config: GameConfig) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.reduce((acc, player) => {
            return acc && player.finished;
        }, true);
    }

    async run(players: Player[]): Promise<boolean> {
        const [ winner, loser ] = getWinnerAndLoser(players[0], players[1]);
        const keysPressedDifference = winner.stats.keysPressed.length -
                loser.stats.keysPressed.length;
        const scoreDifference = winner.stats.score - loser.stats.score;
        const timeDifference = winner.stats.timeTaken - loser.stats.timeTaken;

        const score: WinningMessage = {
            ...getFinishedMessage(),
            scoreDifference,
            keysPressedDifference,
            timeDifference,
        };

        const winnerMsg = displayEndGameMessage(score);
        const loserMsg = displayEndGameMessage({
            ...score,
            winner: false,
            scoreDifference: -scoreDifference,
            keysPressedDifference: -keysPressedDifference,
            timeDifference: -timeDifference,
        });

        await Promise.all([
            runAndReportFailure(winner, winnerMsg, this.config.logger),
            runAndReportFailure(loser, loserMsg, this.config.logger),
        ]);

        return true;
    }

    async exit(): Promise<void> { }
}

