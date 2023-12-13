// --- Part Two ---
// You resume walking through the valley of mirrors and - SMACK! - run directly into one. Hopefully nobody was watching, because that must have been pretty embarrassing.

// Upon closer inspection, you discover that every mirror has exactly one smudge: exactly one . or # should be the opposite type.

// In each pattern, you'll need to locate and fix the smudge that causes a different reflection line to be valid. (The old reflection line won't necessarily continue being valid after the smudge is fixed.)

// Here's the above example again:

// #.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.

// #...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#
// The first pattern's smudge is in the top-left corner. If the top-left # were instead ., it would have a different, horizontal line of reflection:

// 1 ..##..##. 1
// 2 ..#.##.#. 2
// 3v##......#v3
// 4^##......#^4
// 5 ..#.##.#. 5
// 6 ..##..##. 6
// 7 #.#.##.#. 7
// With the smudge in the top-left corner repaired, a new horizontal line of reflection between rows 3 and 4 now exists. Row 7 has no corresponding reflected row and can be ignored, but every other row matches exactly: row 1 matches row 6, row 2 matches row 5, and row 3 matches row 4.

// In the second pattern, the smudge can be fixed by changing the fifth symbol on row 2 from . to #:

// 1v#...##..#v1
// 2^#...##..#^2
// 3 ..##..### 3
// 4 #####.##. 4
// 5 #####.##. 5
// 6 ..##..### 6
// 7 #....#..# 7
// Now, the pattern has a different horizontal line of reflection between rows 1 and 2.

// Summarize your notes as before, but instead use the new different reflection lines. In this example, the first pattern's new horizontal line has 3 rows above it and the second pattern's new horizontal line has 1 row above it, summarizing to the value 400.

// In each pattern, fix the smudge and find the different line of reflection. What number do you get after summarizing the new reflection line in each pattern in your notes?

import * as fs from 'fs';

const input: string = fs.readFileSync('day13/day13_input.txt', 'utf8');

const getMirrorIndex = (graph: string[][]): number => {
    const totalRows: number = graph.length, totalCols: number = graph[0].length;
    for(let potentialMirrorIndex: number = 1; potentialMirrorIndex < totalCols; potentialMirrorIndex++) {
        let reflectionMismatches: number = 0;
        for(let offsetToReflectionIndex: number = 0; offsetToReflectionIndex < Math.min(potentialMirrorIndex, totalCols - potentialMirrorIndex); offsetToReflectionIndex++) {
            for(let row: number = 0; row < totalRows; row++) {
                if(graph[row][potentialMirrorIndex - offsetToReflectionIndex - 1] !== graph[row][potentialMirrorIndex + offsetToReflectionIndex])  {
                    reflectionMismatches += 1;
                }
            }
        }
        if(reflectionMismatches === 1) return potentialMirrorIndex;
    }
    return 0;
}

const transpose = (graph: string[][]): string[][] => {
    const totalRows: number = graph.length, totalCols: number = graph[0].length;
    const transposedGraph: string[][] = [];
    for(let columnIndex = 0; columnIndex < totalCols; columnIndex++) {
        transposedGraph.push([]);
        for(let rowIndex = 0; rowIndex < totalRows; rowIndex++)
            transposedGraph[columnIndex].push(graph[rowIndex][columnIndex]);
    }
    return transposedGraph;
}

const solve = (input: string): number => {
    return input.split('\n\n').map((section: string) => {
        const graph: string[][] = section.split('\n').map((line: string) => line.split(''));
        const verticalMirrorIndex: number = getMirrorIndex(graph);
        return verticalMirrorIndex !== 0 ? verticalMirrorIndex : getMirrorIndex(transpose(graph)) * 100;
    }).reduce((acc: number, val: number) => acc + val, 0);
}

console.log(solve(input));
