function wait(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export default function race(time: number, ...promises: Promise<unknown>[]): Promise<unknown[]> {
    return Promise.race([
        Promise.all(promises),
        wait(time).then(() => {
            throw new Error("TimedOut")
        }),
    ]);
}

