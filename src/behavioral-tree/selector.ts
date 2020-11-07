import {
    BehavorialNode,
    Player,
} from "../types";

export default class SelectorNode implements BehavorialNode {
    private currentNode: BehavorialNode = null;

    constructor(private nodes: BehavorialNode[]) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        if (this.currentNode) {
            return this.currentNode.shouldEnter(players);
        }

        let shouldEnter = false;
        for (let i = 0; !shouldEnter && i < this.nodes.length; ++i) {
            shouldEnter = await this.nodes[i].shouldEnter(players);
            if (shouldEnter) {
                this.currentNode = this.nodes[i];
                await this.currentNode.enter();
            }
        }

        return shouldEnter;
    }

    async run(): Promise<void> {
        return this.currentNode.run();
    }

    async exit(): Promise<void> {
        if (this.currentNode) {
            await this.currentNode.exit();
        }
        this.currentNode = null;
    }
}




