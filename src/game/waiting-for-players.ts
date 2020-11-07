import padMessage from "./utils/padMessage";
import { Player } from "../types";

export const WaitingForPlayersMsg = " Waiting for other player to connect...";

export default async function sendWaitingForPlayer(player: Player) {
    await player.send("waiting", {
        left: padMessage([
            WaitingForPlayersMsg,
        ]),
        editable: false
    });
}


