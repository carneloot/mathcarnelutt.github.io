export const map = (value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) => {
    const a = (fromHigh - fromLow) / (value - fromLow);
    if (a === Infinity || value === fromLow) {
        return toLow;
    }
    return ((toHigh - toLow) / ((fromHigh - fromLow) / (value - fromLow))) + toLow;
};
