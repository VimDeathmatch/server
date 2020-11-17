import pino from "pino";

import server from "./server";

server(pino({name: "EntryPoint"}));

