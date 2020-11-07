import pino from "pino";

import HandleMsg, {State} from "../networking/handle-messages";

const logger = pino({name: "handle-message__tests__"});
describe("HandleMsg", function() {
    it("parse out an empty message", function() {
        const handle = new HandleMsg(logger);

        expect(handle.state).toEqual(State.WaitingForLength);
        handle.parse(`0:ready`);
        expect(handle.state).toEqual(State.WaitingForType);
        const {
            completed,
            type,
            message: dat,
        } = handle.parse(`:`);

        expect(handle.state).toEqual(State.WaitingForLength);
        expect(completed).toEqual(true);
        expect(type).toEqual("ready");
        expect(dat).toEqual("");
    });

    it("parse out the length, type, and message correctly", function() {
        const handle = new HandleMsg(logger);
        const msg = JSON.stringify({foo: "bar"});

        expect(handle.state).toEqual(State.WaitingForLength);
        handle.parse(`${msg.length}:onteuh`);
        expect(handle.state).toEqual(State.WaitingForType);
        handle.parse(`:`);
        expect(handle.state).toEqual(State.WaitingForData);
        const {
            completed,
            type,
            message: dat,
        } = handle.parse(msg);

        expect(completed).toEqual(true);
        expect(type).toEqual("onteuh");
        expect(dat).toEqual(msg);
    });
});

