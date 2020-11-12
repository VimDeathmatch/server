import {
    BehavorialNode,
    Player,
} from "../../types";

export default class SequenceNode implements BehavorialNode {
    private index: number;
    private lastRanNode: BehavorialNode | null;

    constructor(private nodes: BehavorialNode[]) {
        this.index = 0;
        this.lastRanNode = null;
    }

    async enter(): Promise<void> {
        this.index = 0;
    }

    private getNextNode(): BehavorialNode | undefined {
        return this.nodes[++this.index];
    }

    private hasNodesLeft(): boolean {
        return this.nodes.length > this.index;
    }

    private async attemptToEnter(node: BehavorialNode, players: Player[]): Promise<boolean> {
        const shouldEnter = await node.shouldEnter(players);
        if (shouldEnter) {
            this.lastRanNode = node;
            await this.lastRanNode.enter();
        }
        return shouldEnter;
    }

    private getCurrentNode(): BehavorialNode {
        return this.nodes[this.index];
    }

    async shouldEnter(players: Player[]): Promise<boolean> {
        if (this.lastRanNode === null) {
            return this.attemptToEnter(this.getCurrentNode(), players);
        }

        let shouldEnter = false;
        let previous: BehavorialNode | null = this.lastRanNode;

        do {
            shouldEnter = await this.getCurrentNode().shouldEnter(players);
            if (shouldEnter) {
                if (previous === null) {
                    await this.getCurrentNode().enter();
                }

                this.lastRanNode = this.getCurrentNode();
            }

            else {
                if (previous) {
                    await previous.exit();
                    previous = null;
                }
                this.getNextNode();
            }

        } while (!shouldEnter && this.hasNodesLeft());

        return shouldEnter;
    }

    async run(players: Player[]): Promise<boolean> {
        return this.lastRanNode.run(players);
    }

    async exit(): Promise<void> { }
}



