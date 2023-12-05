// --- Part Two ---
// Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

// The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

// seeds: 79 14 55 13
// This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

// Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

// In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

// Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?

import * as fs from 'fs';

const input: string = fs.readFileSync('day05/day05_input.txt', 'utf8');

const parseRangeMaps = (input: string): number[][] => {
    return input.split('\n').slice(1)
        .map((line: string) => line.split(' ')
        .filter((val: string) => val != '')
        .map(Number));
}

const transform = (inputRanges: number[][], rangeMapping: number[][]): number[][] => {
    const resultRanges: number[][] = [];
    rangeMapping.forEach((range: number[]) => {
        const [destination, source, count] = range, srcEnd: number = source + count;
        const unmappedRanges: number[][] = [];
        inputRanges.forEach((item: number[]) => {
            const [start, end] = item;
            const beforeInputRange: number[] = [start, Math.min(end, source)];
            const overlapInputRange: number[] = [Math.max(start, source), Math.min(end, srcEnd)];
            const afterInputRange: number[] = [Math.max(start, srcEnd), end];
            if(beforeInputRange[1] > beforeInputRange[0]) unmappedRanges.push(beforeInputRange);
            if(overlapInputRange[1] > overlapInputRange[0]) resultRanges.push([overlapInputRange[0] - source + destination, overlapInputRange[1] - source + destination]);
            if(afterInputRange[1] > afterInputRange[0]) unmappedRanges.push(afterInputRange);
        });
        inputRanges = unmappedRanges;
    });
    resultRanges.push(...inputRanges)
    return resultRanges;
}

const solve = (input: string): number => {
    const sections: string[] = input.split('\n\n');
    const seedValueRanges: number[][] = sections[0].split(' ')
        .slice(1).filter((val: string) => val != '')
        .map(Number)
        .reduce((acc: number[][], _: number, idx: number, array: number[]) => idx % 2 == 0 ? [...acc, array.slice(idx, idx + 2)] : acc, [])
        .map((range: number[]) => [range[0], range[0] + range[1]]);
    let resultRanges: number[][] = seedValueRanges;
    sections.slice(1).map((section: string) => parseRangeMaps(section))
        .forEach((transformation: number[][]) => resultRanges = transform(resultRanges, transformation));
    return resultRanges.reduce((acc: number, range: number[]) => Math.min(range[0], acc), Number.POSITIVE_INFINITY);
}

console.log(solve(input))
