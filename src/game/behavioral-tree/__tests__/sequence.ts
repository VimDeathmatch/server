import { BehavorialNode } from "../../../types";

import SequenceNode from "../sequence";

import {
    TurnOnNode,
    spyOn,
} from "../../../__mocks__/bnode";

describe("Sequence Node", function() {

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

        await sequence.run([]);
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

        await sequence.run([]);
        expect(n0.run).toBeCalledTimes(1);
        expect(await sequence.shouldEnter([])).toEqual(true);
        await sequence.run([]);
        expect(n0.shouldEnter).toBeCalledTimes(2);
        expect(n0.run).toBeCalledTimes(2);

        n0.setShouldEnter(false);
        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(3);
        expect(n0.exit).toBeCalledTimes(1);
        expect(n1.shouldEnter).toBeCalledTimes(1);
        expect(n1.enter).toBeCalledTimes(1);

        await sequence.run([]);
        expect(n1.run).toBeCalledTimes(1);
    });

    it("call each node, and skip the middle one.", async function() {
        const n0 = spyOn(new TurnOnNode(0)) as TurnOnNode;
        const n1 = spyOn(new TurnOnNode(1)) as TurnOnNode;
        const n2 = spyOn(new TurnOnNode(2)) as TurnOnNode;

        const nodes = [ n0, n1, n2 ];
        const sequence = new SequenceNode(nodes);

        n0.setShouldEnter(true);
        n1.setShouldEnter(false);
        n2.setShouldEnter(true);

        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(1);
        expect(n0.enter).toBeCalledTimes(1);

        await sequence.run([]);
        expect(n0.run).toBeCalledTimes(1);

        n0.setShouldEnter(false);

        expect(await sequence.shouldEnter([])).toEqual(true);
        expect(n0.shouldEnter).toBeCalledTimes(2);
        expect(n0.exit).toBeCalledTimes(1);

        expect(n1.shouldEnter).toBeCalledTimes(1);
        expect(n1.enter).toBeCalledTimes(0);
        expect(n1.exit).toBeCalledTimes(0);
        expect(n2.shouldEnter).toBeCalledTimes(1);
        expect(n2.enter).toBeCalledTimes(1);

        await sequence.run([]);
        expect(n1.run).toBeCalledTimes(0);
        expect(n2.run).toBeCalledTimes(1);

        n2.setShouldEnter(false);
        expect(await sequence.shouldEnter([])).toEqual(false);
        expect(n2.shouldEnter).toBeCalledTimes(2);
        expect(n2.exit).toBeCalledTimes(1);
    });
});

