import pino from "pino";

import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../../types";
import padMessage from "../../utils/padMessage";

export const WaitingForPlayersMsg = " Waiting for other player to connect...";
export async function sendWaitingForPlayer(player: Player) {
    await player.send("waiting", {
        left: padMessage([
            WaitingForPlayersMsg,
        ]),
        editable: false
    });
}

export function playerJoin(player: Player): Promise<string> {
    return new Promise((res, rej) => {

        async function onMessage(type: string, msg: string) {

            // TODO(v2): Names
            if (type === "ready") {
                player.off("msg", onMessage);
                res(msg);
                player.ready = true;
                await sendWaitingForPlayer(player);
                return;
            }

            player.failed = true;
            rej(new Error("Unexpected message type when player joining"));
        }

        player.on("msg", onMessage);
    });
}

export default class PlayerJoinNode implements BehavorialNode {
    private logger: pino.Logger;
    private joinRequests: boolean[];

    constructor(private config: GameConfig) {
        this.joinRequests = [];
        this.logger = config.logger.child({ name: "PlayerJoinNode" });
    }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {

        this.logger.info("should enter playerJoin node", {
            playerCount: players.length,
        });

        let failed = false;
        let ready = true;
        for (let i = 0; !failed && i < players.length; ++i) {
            failed = players[i].failed;
            ready = ready && players[i].ready;
        }

        return !failed && (players.length !== this.config.maxPlayers || !ready);
    }

    async run(players: Player[]): Promise<void> {
        if (this.joinRequests.length === players.length) {
            return;
        }

        for (let i = this.joinRequests.length; i < players.length; ++i) {
            this.joinRequests.push(true);
            playerJoin(players[i]);
        }
    }

    async exit(): Promise<void> { }
}


