import {
    BehavorialNode,
    Player,
} from "../../types";

export default class SelectorNode implements BehavorialNode {
    private currentNode: BehavorialNode = null;

    constructor(private nodes: BehavorialNode[]) { }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        if (this.currentNode) {

            if (await this.currentNode.shouldEnter(players)) {
                return true;
            }

            await this.currentNode.exit();
            this.currentNode = null;
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

    async run(players: Player[]): Promise<boolean> {
        return this.currentNode.run(players);
    }

    async exit(): Promise<void> {
        if (this.currentNode) {
            await this.currentNode.exit();
        }
        this.currentNode = null;
    }
}




