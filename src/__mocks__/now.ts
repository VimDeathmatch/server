let timeToReturn = 0;
jest.mock("src/now", () => ({
    __esModule: true, // this property makes it work
    default: () => timeToReturn,
}));

export function setReturnTime(time: number) {
    timeToReturn = time;
}
