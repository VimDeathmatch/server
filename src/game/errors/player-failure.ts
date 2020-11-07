import {
    Player
} from "../../types";

export default class PlayerFailure extends Error {
    constructor(public player: Player, public reason: Error) {
        super();
    }
}


