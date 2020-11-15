import * as pino from "pino";
import {
    DisplayMessage,
    Player,
} from "../../../../types";

export async function runAndReportFailure(player: Player, message: DisplayMessage, logger: pino.Logger): Promise<void> {
    try {
        await player.send("finished", message);
    } catch (e) {
        logger.error(e, "Player errored out", { player });
    }
}


