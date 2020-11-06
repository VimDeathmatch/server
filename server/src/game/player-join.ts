import * as net from "net";
import pino from "pino";

import { createPlayer } from "../player";
import { Player } from "../types";

export function playerJoin(player: Player): Promise<string> {
    return new Promise((res, rej) => {
        function onMessage(type, msg) {

            // TODO(v2): Names
            if (type === "ready") {
                player.off("msg", onMessage);
                res(msg);
            }

            rej(new Error("Unexpected message type when player joining"));
        }

        player.on("msg", onMessage);
    });
}

