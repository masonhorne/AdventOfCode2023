// --- Part Two ---
// The galaxies are much older (and thus much farther apart) than the researcher initially estimated.

// Now, instead of the expansion you did before, make each empty row or column one million times larger. That is, each empty row should be replaced with 1000000 empty rows, and each empty column should be replaced with 1000000 empty columns.

// (In the example above, if each empty row or column were merely 10 times larger, the sum of the shortest paths between every pair of galaxies would be 1030. If each empty row or column were merely 100 times larger, the sum of the shortest paths between every pair of galaxies would be 8410. However, your universe will need to expand far beyond these values.)

// Starting with the same initial image, expand the universe according to these new rules, then find the length of the shortest path between every pair of galaxies. What is the sum of these lengths?

import * as fs from 'fs';

const input: string = fs.readFileSync('day11/day11_input.txt', 'utf8');

const parseGalaxyMap = (input: string): any[] => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    const emptyRows: Set<number> = new Set();
    const emptyCols: Set<number> = new Set();
    const galaxies: number[][] = [];
    for(let row: number = 0; row < graph.length; row++) {
        const rowValues: string[] = [];
        const colValues: string[] = [];
        for(let col: number = 0; col < graph[row].length; col++) {
            if(graph[row][col] === '#') galaxies.push([row, col]);
            rowValues.push(graph[row][col]);
            colValues.push(graph[col][row]);
        }
        if(rowValues.every((character: string) => character === '.')) emptyRows.add(row);
        if(colValues.every((character: string) => character === '.')) emptyCols.add(row);
    }
    return [emptyRows, emptyCols, galaxies];
}

const solve = (input: string): number => {
    const [emptyRows, emptyCols, galaxies] = parseGalaxyMap(input);
    let result: number = 0;
    for(let nodeOne: number = 0; nodeOne < galaxies.length; nodeOne++) {
        for(let nodeTwo: number = nodeOne + 1; nodeTwo < galaxies.length; nodeTwo++) {
            let minCost: number = Math.abs(galaxies[nodeOne][0] - galaxies[nodeTwo][0]) + Math.abs(galaxies[nodeOne][1] - galaxies[nodeTwo][1]);
            for(let row: number = Math.min(galaxies[nodeOne][0], galaxies[nodeTwo][0]); row <= Math.max(galaxies[nodeOne][0], galaxies[nodeTwo][0]); row++) 
                if(emptyRows.has(row)) minCost += 999999;
            for(let col: number = Math.min(galaxies[nodeOne][1], galaxies[nodeTwo][1]); col <= Math.max(galaxies[nodeOne][1], galaxies[nodeTwo][1]); col++)
                if(emptyCols.has(col)) minCost += 999999;
            result += minCost;
        }
    }
    return result;
}

console.log(solve(input));
