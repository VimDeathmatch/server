import { BehavorialNode } from "../../types";

import SelectorNode from "../selector";

import {
    OneShotNode,
} from "../../__mocks__/bnode";

describe("Selector Node", function() {

    function spyOn(node: BehavorialNode): BehavorialNode {
        jest.spyOn(node, "run");
        jest.spyOn(node, "shouldEnter");
        jest.spyOn(node, "enter");
        jest.spyOn(node, "exit");

        return node;
    }

    async function testNode(selector: BehavorialNode, node: BehavorialNode) {
        let shouldEnter = await selector.shouldEnter([]);
        expect(shouldEnter).toEqual(true);
        await selector.enter();

        await selector.run();
        expect(node.enter).toHaveBeenCalledTimes(1);
        expect(node.shouldEnter).toHaveBeenCalledTimes(1);
        expect(node.exit).toHaveBeenCalledTimes(0);
        expect(node.run).toHaveBeenCalledTimes(1);

        shouldEnter = await selector.shouldEnter([]);
        expect(shouldEnter).toEqual(false);
        expect(node.shouldEnter).toHaveBeenCalledTimes(2);
        await selector.exit();
        expect(node.exit).toHaveBeenCalledTimes(1);
    }

    it("should cycle through the nodes and pick the first one.", async function() {
        const n0 = spyOn(new OneShotNode(0));
        const n1 = spyOn(new OneShotNode(1));

        const nodes = [ n0, n1 ];
        const selector = new SelectorNode(nodes);

        await testNode(selector, n0);
        expect(n1.shouldEnter).toHaveBeenCalledTimes(0);
        await testNode(selector, n1);
    });
});

