import { BehavorialNode } from "../../../types";

import SelectorNode from "../selector";

import {
    OneShotNode,
    NeverNode,
    spyOn,
} from "../../../__mocks__/bnode";

describe("Selector Node", function() {

    it("should cycle through the nodes and pick the first one.", async function() {
        const n0 = spyOn(new OneShotNode(0));
        const n1 = spyOn(new NeverNode(1));
        const n2 = spyOn(new OneShotNode(2));

        const nodes = [ n0, n1, n2 ];
        const selector = new SelectorNode(nodes);

        expect(await selector.shouldEnter([])).toEqual(true);
        await selector.enter();
        await selector.run([]);

        expect(n0.enter).toHaveBeenCalledTimes(1);
        expect(n0.shouldEnter).toHaveBeenCalledTimes(1);
        expect(n0.exit).toHaveBeenCalledTimes(0);
        expect(n0.run).toHaveBeenCalledTimes(1);

        expect(await selector.shouldEnter([])).toEqual(true);
        expect(n0.exit).toHaveBeenCalledTimes(1);

        expect(n0.shouldEnter).toHaveBeenCalledTimes(3);
        expect(n1.shouldEnter).toHaveBeenCalledTimes(1);
        expect(n2.shouldEnter).toHaveBeenCalledTimes(1);
        expect(n2.enter).toHaveBeenCalledTimes(1);
        await selector.run([]);

        expect(n2.run).toHaveBeenCalledTimes(1);
        expect(n2.exit).toHaveBeenCalledTimes(0);

        expect(await selector.shouldEnter([])).toEqual(false);
        expect(n2.exit).toHaveBeenCalledTimes(1);
        expect(n0.shouldEnter).toHaveBeenCalledTimes(4);
        expect(n1.shouldEnter).toHaveBeenCalledTimes(2);
        expect(n2.shouldEnter).toHaveBeenCalledTimes(3);
    });
});

