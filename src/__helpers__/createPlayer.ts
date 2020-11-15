import pino from "pino";

import { Player } from "../types";
import { PlayerImpl } from "../game/player";
import {
    spyOn,
} from "../__mocks__/bnode";
import MockSocket from "../__mocks__/socket";

const l = pino({name: "__helpers__createPlayer"});
export function createPlayer(logger: pino.Logger = l): [Player, MockSocket] {
    const s1 = new MockSocket();

    // @ts-ignore
    const p1 = new PlayerImpl(s1, logger)
    return [ p1, s1 ];
}

