import {
    BehavorialNode,
    Player,
} from "../types";

export default class SequenceNode implements BehavorialNode {
    private index: number;
    private currentNode: BehavorialNode | null;

    constructor(private nodes: BehavorialNode[]) {
        this.index = 0;
        this.currentNode = null;
    }

    async enter(): Promise<void> {
        this.index = 0;
    }

    private getNextNode(): BehavorialNode | undefined {
        return this.nodes[++this.index];
    }

    private async attemptToEnter(node: BehavorialNode, players: Player[]): Promise<boolean> {
        const shouldEnter = await node.shouldEnter(players);
        if (shouldEnter) {
            this.currentNode = node;
            await this.currentNode.enter();
        }
        return shouldEnter;
    }

    async shouldEnter(players: Player[]): Promise<boolean> {
        if (this.currentNode === null) {
            return this.attemptToEnter(this.nodes[0], players);
        }

        const shouldEnter = await this.currentNode.shouldEnter(players);
        if (!shouldEnter) {
            await this.currentNode.exit();
            this.currentNode = null;
            return this.attemptToEnter(this.getNextNode(), players);
        }

        return shouldEnter;
    }

    async run(): Promise<void> {
        return this.currentNode.run();
    }

    async exit(): Promise<void> { }
}



