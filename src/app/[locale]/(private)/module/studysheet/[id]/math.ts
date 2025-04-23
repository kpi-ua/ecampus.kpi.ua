export function round(value: number, precision: number = 0) {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
}