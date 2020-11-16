import pino from "pino";
import now from "../now";

export function keyStrokeScore(keysPressed: string[]) {
    return 10000 - 10000 * Math.min(keysPressed.length / 30, 1);
};

export function timeTakenMSScore(timeTaken: number) {
    return 10000 - 10000 * Math.min(timeTaken / 30000, 1);
};

export interface IPlayerStats {
    keys: string[];
    undoCount: number;
};

export class PlayerStats {
    keys: string[];
    undoCount: number;
    failed: boolean = false;

    constructor(fromData: string) {
        try {
            const stats = JSON.parse(fromData);

            if (this.validate(stats)) {
                this.keys = stats.keys;
                this.undoCount = stats.undoCount;
            } else {
                this.failed = true;
            }
        } catch (e) {
            this.failed = true;
        }
    }


    private validate(data: IPlayerStats): boolean {
        if (!Array.isArray(data.keys) ||
            data.keys.filter(x => typeof x !== "string").length) {
            return false;
        }

        if (typeof data.undoCount !== "number" || isNaN(data.undoCount)) {
            return false;
        }

        return true;
    }
}

export class Stats {
    public timeTaken: number;
    public score: number = 0;
    public keysPressed: string[];

    private startTime: number;
    private logger: pino.Logger;

    constructor(logger: pino.Logger) {
        this.logger = logger.child({name: "Stats"});
    }

    start() {
        this.startTime = now();
        this.keysPressed = [];
    }

    calculateScore(statsFromPlayer: PlayerStats) {
        this.timeTaken = now() - this.startTime;
        this.keysPressed = statsFromPlayer.keys;

        const keyScore = keyStrokeScore(this.keysPressed);
        const timeTaken = timeTakenMSScore(this.timeTaken);
        this.score = keyScore + timeTaken;

        this.logger.info({
            keyScore,
            timeTaken,
        }, "Calculated Score");
    }
}


