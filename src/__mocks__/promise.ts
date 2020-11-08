export function runPendingPromises(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
}


