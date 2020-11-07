import { Player } from "../types";

export default function playerJoin(player: Player): Promise<string> {
    return new Promise((res, rej) => {
        function onMessage(type: string, msg: string) {

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

