import {
    BehavorialNode,
    Player,
} from "../../../../types";

//TODO: Ya. this is a terrible place for enter once...
export default class EnterOnce implements BehavorialNode {
    private entered: boolean;

    constructor(private node: BehavorialNode) { }

    async enter(): Promise<void> {
        this.node.enter();
        this.entered = true;
    }

    async shouldEnter(players: Player[]): Promise<boolean> {
        if (this.entered) {
            return false;
        }

        return this.node.shouldEnter(players);
    }

    async run(players: Player[]): Promise<boolean> {
        return this.node.run(players);
    }

    async exit(): Promise<void> {
        this.node.exit();
    }

    reset() {
        this.entered = false;
    }
}

