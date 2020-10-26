import * as fs from "fs";
import * as path from "path";

export type PuzzleGenerator = {
    start: (...args: any[]) => void,
    end: (...args: any[]) => void,
    filetype: string,
};

export type Puzzle = {
    filetype: string,
    start: string[],
    end: string[],
};

const files: Puzzle[] = fs.readdirSync(__dirname).
    map(file => {
        if (file.includes("index")) {
            return null;
        }
        const contents = require(path.join(__dirname, file)) as PuzzleGenerator;
        return {
            start: stripFunction(contents.start),
            end: stripFunction(contents.end),
            filetype: contents.filetype,
        };
    }).
    filter(x => x);

console.log("FILES");

function stripFunction(fn: Function) {
    const functionContents = fn.toString();
    return functionContents.
        substring(functionContents.indexOf("{") + 1, functionContents.length - 1).
        split("\n");
}

export default function generate(): Puzzle {
    return files[Math.floor(files.length * Math.random())];
};

