import pino from "pino";

import {
    BehavorialNode,
    Player,
    GameConfig,
} from "../../../types";
import padMessage from "../../utils/padMessage";

function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export const WaitingForPlayersMsg = " Waiting for other player to connect...";
export async function sendWaitingForPlayer(player: Player) {
    await player.send("waiting", {
        left: padMessage([
            WaitingForPlayersMsg,
        ]),
        editable: false
    });
}

export function playerJoin(player: Player, config: GameConfig): Promise<void> {

    let finished = false;
    const out: Promise<void> = new Promise((res, rej) => {
        async function onMessage(type: string, msg: string) {
            finished = true;
            config.logger.info({type, msg}, "onMessage");

            // TODO(v2): Names
            if (type === "ready") {
                player.off("msg", onMessage);
                player.ready = true;
                res();
                await sendWaitingForPlayer(player);
                return;
            }

            player.failed = true;
            rej(new Error("Unexpected message type when player joining"));
        }

        player.on("msg", onMessage);
    });

    return Promise.race([
        out,
        wait(config.maxReadyTime).then(() => {
            if (!finished) {
                player.failed = true;
            }
        }),
    ]);
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

        this.logger.info({
            playerCount: players.length,
        }, "should enter playerJoin node");

        let failed = false;
        let ready = true;
        for (let i = 0; !failed && i < players.length; ++i) {
            failed = players[i].failed ||
                players[i].disconnected || players[i].timedout;

            ready = ready && players[i].ready;
        }

        return !failed && (players.length !== this.config.maxPlayers || !ready);
    }

    async run(players: Player[]): Promise<boolean> {
        if (this.joinRequests.length === players.length) {
            return;
        }

        for (let i = this.joinRequests.length; i < players.length; ++i) {
            this.joinRequests.push(true);
            playerJoin(players[i], this.config);
        }
        return false;
    }

    async exit(): Promise<void> { }
}


