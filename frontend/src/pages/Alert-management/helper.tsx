export function getDivSize(
    count: number,
    largestCount: number,
    minSize = 100,
    maxSize = 400,
    width = 140
) {
    const scale = count / largestCount;
    const size = minSize + scale * (maxSize - minSize);

    return {
        width: `${width}px`,
        height: `${size}px`,
    }
}
