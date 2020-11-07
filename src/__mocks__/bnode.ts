import { BehavorialNode, Player } from "../types";

export class OneShotNode implements BehavorialNode {
    constructor(public id: number) {}

    private entered = false;

    async enter(): Promise<void> {
        this.entered = true;
    }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return !this.entered;
    }

    async exit(): Promise<void> { }

    async run(): Promise<void> { }
}

export class TurnOnNode implements BehavorialNode {
    constructor(public id: number) {}

    private returnEnter = false;

    setShouldEnter(enter: boolean) {
        this.returnEnter = enter;
    }

    async enter(): Promise<void> { }

    async shouldEnter(players: Player[]): Promise<boolean> {
        return this.returnEnter;
    }

    async exit(): Promise<void> { }

    async run(): Promise<void> { }
}

