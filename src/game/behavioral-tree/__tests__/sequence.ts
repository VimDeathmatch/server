import { BehavorialNode } from "../../../types";

import SequenceNode from "../sequence";

import {
    TurnOnNode,
} from "../../../__mocks__/bnode";

describe("Sequence Node", function() {

    function spyOn(node: BehavorialNode): BehavorialNode {
        jest.spyOn(node, "run");
        jest.spyOn(node, "shouldEnter");
        jest.spyOn(node, "enter");
        jest.spyOn(node, "exit");

        return node;
    }

    it("should run no nodes if first returns false.", async function() {
        const n0 = spyOn(new TurnOnNode(0));
        const n1 = spyOn(new TurnOnNode(1));

        const nodes = [ n0, n1 ];
        const sequence = new SequenceNode(nodes);

        expect(await sequence.shouldEnter([])).toEqual(false);
        expect(n0.shouldEnter).toBeCalledTimes(1);
        expect(n0.enter).toBeCalledTimes(0);
        expect(n0.enter).toBeCalledTimes(0);
        expect(n0.exit).toBeCalledTimes(0);
        expect(n0.run).toBeCalledTimes(0);
        expect(n1.shouldEnter).toBeCalledTimes(0);
    });

    it("should properly enter and exit after running.", async function() {
        const n0 = spyOn(new TurnOnNode(0)) as TurnOnNode;
        const n1 = spyOn(new TurnOnNode(1));

        const nodes = [ n0, n1 ];
        const sequence = new SequenceNode(nodes);

        n0.setShouldEnter(true);
        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(1);
        expect(n0.enter).toBeCalledTimes(1);
        expect(n0.exit).toBeCalledTimes(0);
        expect(n0.run).toBeCalledTimes(0);

        await sequence.run();
        expect(n0.run).toBeCalledTimes(1);

        n0.setShouldEnter(false);
        expect(await sequence.shouldEnter([])).toEqual(false);
        expect(n0.shouldEnter).toBeCalledTimes(2);
        expect(n0.exit).toBeCalledTimes(1);
        expect(n1.shouldEnter).toBeCalledTimes(1);
    });

    it("should each node in sequence.", async function() {
        const n0 = spyOn(new TurnOnNode(0)) as TurnOnNode;
        const n1 = spyOn(new TurnOnNode(1)) as TurnOnNode;

        const nodes = [ n0, n1 ];
        const sequence = new SequenceNode(nodes);

        n0.setShouldEnter(true);
        n1.setShouldEnter(true);

        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(1);
        expect(n0.enter).toBeCalledTimes(1);

        await sequence.run();
        expect(n0.run).toBeCalledTimes(1);
        expect(await sequence.shouldEnter([])).toEqual(true);
        await sequence.run();
        expect(n0.shouldEnter).toBeCalledTimes(2);
        expect(n0.run).toBeCalledTimes(2);

        n0.setShouldEnter(false);
        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(3);
        expect(n0.exit).toBeCalledTimes(1);
        expect(n1.shouldEnter).toBeCalledTimes(1);
        expect(n1.enter).toBeCalledTimes(1);
        await sequence.run();
        expect(n1.run).toBeCalledTimes(1);
    });
});

