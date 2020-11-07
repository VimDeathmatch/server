export default function padMessage(message: string[]): string[] {
    message.unshift("");
    message.unshift("");
    message.push("");
    message.push("");
    return message;
}

