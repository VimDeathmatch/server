import pino from "pino";
import * as net from "net";

const PORT = 42069;
const HOST = "0.0.0.0";

export default function createSocket(logger: pino.Logger): Promise<net.Socket> {
    return new Promise((res, rej) => {
        const client = new net.Socket();

        function onError(e) {
            logger.fatal(e, "unable to createSocket (__manual_tests__)");
            rej(e);
        }

        client.connect(PORT, HOST, function() {
            client.off("error", onError);
            res(client);
        });

        client.on("error", onError);
    });
}
