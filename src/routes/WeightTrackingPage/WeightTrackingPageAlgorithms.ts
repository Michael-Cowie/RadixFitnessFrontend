export function createDisplayText(range: number): string {
    if (range === Infinity) return "All";
    return `${range} days`;
}
