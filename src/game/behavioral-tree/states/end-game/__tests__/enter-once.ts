import EnterOnce from "../enter-once";
import {
    TurnOnNode,
    spyOn,
} from "../../../../../__mocks__/bnode";

describe("Enter Once", function() {
    it("should enter once", async function() {
        const turnMeOn = spyOn(new TurnOnNode()) as TurnOnNode;
        const once = spyOn(new EnterOnce(turnMeOn));

        turnMeOn.setShouldEnter(false);

        expect(await once.shouldEnter([])).toEqual(false);
        expect(once.shouldEnter).toBeCalledTimes(1);
        expect(turnMeOn.shouldEnter).toBeCalledTimes(1);

        turnMeOn.setShouldEnter(true);
        turnMeOn.setRunReturn(true);

        expect(await once.shouldEnter([])).toEqual(true);
        expect(once.shouldEnter).toBeCalledTimes(2);
        expect(turnMeOn.shouldEnter).toBeCalledTimes(2);

        await once.enter();

        expect(once.enter).toBeCalledTimes(1);
        expect(turnMeOn.enter).toBeCalledTimes(1);

        expect(await once.run([])).toEqual(true);
        expect(once.run).toBeCalledTimes(1);
        expect(turnMeOn.run).toBeCalledTimes(1);

        expect(await once.shouldEnter([])).toEqual(false);
        expect(turnMeOn.shouldEnter).toBeCalledTimes(2);
        expect(once.shouldEnter).toBeCalledTimes(3);

        await once.exit();
        expect(turnMeOn.exit).toBeCalledTimes(1);
        expect(once.exit).toBeCalledTimes(1);
    });
});

