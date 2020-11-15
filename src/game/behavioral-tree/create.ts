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
} from "./states";

export default function create() {
    return new Sequence([
        new PlayerJoinNode(),
        new PlayGameNode(),
        new EnterOnce(new Selector([
            new FailedNode(),
            new DisconnectNode(),
            new SuccessNode(),
            new TimedoutNode(),
        ])),
    ]);
};
