import Sequence from "./sequence";
import Selector from "./selector";
import EnterOnce from "./states/end-game/enter-once";

import {
    PlayerJoinNode,
    PlayGameNode,
    FailedNode,
    DisconnectNode,
    SuccessNode,
    TimedoutNode,
    EndGameNode,
    // TODO: Why the index??
} from "./states/index";
import { GameConfig } from "src/types";

export default function create(config: GameConfig) {
    return new Sequence([
        new PlayerJoinNode(config),
        new PlayGameNode(config),
        new EnterOnce(new Selector([
            new FailedNode(config),
            new DisconnectNode(config),
            new TimedoutNode(config),
            new SuccessNode(config),
        ])),
        new EnterOnce(new EndGameNode(config)),
    ]);
};
