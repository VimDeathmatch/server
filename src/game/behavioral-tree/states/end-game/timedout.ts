import {
    BehavorialNode,
    Player,
    GameConfig,
    DisplayMessage,
    WinningMessage,
} from "../../../../types";

import {
    runAndReportFailure,
} from "./runAndReportFailure;

import {
    getFinishedMessage,
} from "./finish-message";

import padMessage from "../../../utils/padMessage"

export class TimedoutNode implements BehavorialNode {
    constructor(private config: GameConfig) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return players.reduce((acc: boolean, player: Player) => {
            return acc || player.timedout;
        }, false);
    }

    async run(players: Player[]): Promise<boolean> {
        const [ winner, loser ] = getWinnerAndLoser(players[0], players[1]);
        const score: WinningMessage = {
            ...getFinishedMessage(),
            scoreDifference: winner.stats.score - loser.stats.score,
            keysPressedDifference: winner.stats.keysPressed.length -
                loser.stats.keysPressed.length,
            timeDifference: winner.stats.timeTaken - loser.stats.timeTaken
        };

        const winnerMsg = displayEndGameMessage(score);
        const loserMsg = displayEndGameMessage({
            ...score,
            winner: false,
            timeDifference: loser.stats.timeTaken - winner.stats.timeTaken,
            keysPressedDifference: loser.stats.keysPressed.length -
                winner.stats.keysPressed.length,
        });

        await Promise.all([
            runAndReportFailure(winner, winnerMsg),
            runAndReportFailure(loser, loserMsg),
        ]);

        return true;
    }

    exit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}


