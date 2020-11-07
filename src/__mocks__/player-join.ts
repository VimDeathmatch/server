let currentPromise: Promise<string>;

export function setNextPromise(p: Promise<string>) {
    currentPromise = p;
}

jest.mock("../game/player-join", () =>
    jest.fn().mockImplementation(() => {
        if (!currentPromise) {
            throw new Error("NO PROMISE PROVIDED");
        }

        let promise = currentPromise;
        currentPromise = null;

        return promise;
    })
);
