import { EventEmitter } from "events";

export function onNamedEvent(emitter: EventEmitter, name: string): Promise<void> {
    return new Promise(res => {
        function onEvent() {
            emitter.off(name, onEvent);
            res();
        }

        emitter.on(name, onEvent);
    });
}


