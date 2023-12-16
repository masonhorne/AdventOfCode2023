// --- Part Two ---
// As you try to work out what might be wrong, the reindeer tugs on your shirt and leads you to a nearby control panel. There, a collection of buttons lets you align the contraption so that the beam enters from any edge tile and heading away from that edge. (You can choose either of two directions for the beam if it starts on a corner; for instance, if the beam starts in the bottom-right corner, it can start heading either left or upward.)

// So, the beam could start on any tile in the top row (heading downward), any tile in the bottom row (heading upward), any tile in the leftmost column (heading right), or any tile in the rightmost column (heading left). To produce lava, you need to find the configuration that energizes as many tiles as possible.

// In the above example, this can be achieved by starting the beam in the fourth tile from the left in the top row:

// .|<2<\....
// |v-v\^....
// .v.v.|->>>
// .v.v.v^.|.
// .v.v.v^...
// .v.v.v^..\
// .v.v/2\\..
// <-2-/vv|..
// .|<<<2-|.\
// .v//.|.v..
// Using this configuration, 51 tiles are energized:

// .#####....
// .#.#.#....
// .#.#.#####
// .#.#.##...
// .#.#.##...
// .#.#.##...
// .#.#####..
// ########..
// .#######..
// .#...#.#..
// Find the initial beam configuration that energizes the largest number of tiles; how many tiles are energized in that configuration?

import * as fs from 'fs';

const input: string = fs.readFileSync('day16/day16_input.txt', 'utf8');

const getEnergizedTiles = (graph: string[][], startRow: number, startCol: number, rowDelta: number, colDelta: number) => {
    const visitedStates: Set<string> = new Set();
    const visitedTiles: Set<string> = new Set();
    let stack: number[][] = [[startRow, startCol, rowDelta, colDelta]];
    while(stack.length > 0) {
        const [row, col, rowDelta, colDelta] = stack.pop()!;
        if(row < 0 || row >= graph.length || col < 0 || col >= graph[row].length) continue;
        const key: string = `${row},${col},${rowDelta},${colDelta}`;
        if(visitedStates.has(key)) continue;
        visitedStates.add(key);
        visitedTiles.add(`${row},${col}`);
        if(graph[row][col] === '.') stack.push([row + rowDelta, col + colDelta, rowDelta, colDelta]);
        if(graph[row][col] === '/') {
            if(rowDelta === -1) stack.push([row, col + 1, 0, 1]);
            if(rowDelta === 1) stack.push([row, col - 1, 0, -1]);
            if(colDelta === 1) stack.push([row - 1, col, -1, 0]);
            if(colDelta === -1) stack.push([row + 1, col, 1, 0]);
        }
        if(graph[row][col] === '\\') {
            if(rowDelta === -1) stack.push([row, col - 1, 0, -1]);
            if(rowDelta === 1) stack.push([row, col + 1, 0, 1]);
            if(colDelta === 1) stack.push([row + 1, col, 1, 0]);
            if(colDelta === -1) stack.push([row - 1, col, -1, 0]);
        }
        if(graph[row][col] === '|') {
            if(colDelta === 1 || colDelta === -1) {
                stack.push([row + 1, col, 1, 0]);
                stack.push([row - 1, col, -1, 0]);
            }
            if(rowDelta === 1 || rowDelta === -1) {
                stack.push([row + rowDelta, col, rowDelta, colDelta]);
            }
        }
        if(graph[row][col] === '-') {
            if(rowDelta === 1 || rowDelta === -1) {
                stack.push([row, col + 1, 0, 1]);
                stack.push([row, col - 1, 0, -1]);
            }
            if(colDelta === 1 || colDelta === -1) {
                stack.push([row, col + colDelta, rowDelta, colDelta]);
            }
        }
    }
    return visitedTiles.size;
}

const solve = (input: string): number => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    let result: number = 0;
    for(let row: number = 0; row < graph.length; row++) {
        result = Math.max(result, getEnergizedTiles(graph, row, 0, 0, 1));
        result = Math.max(result, getEnergizedTiles(graph, row, graph[row].length - 1, 0, -1));
    }
    for(let col: number = 0; col < graph[0].length; col++) {
        result = Math.max(result, getEnergizedTiles(graph, 0, col, 1, 0));
        result = Math.max(result, getEnergizedTiles(graph, graph.length - 1, col, -1, 0));
    }
    return result;
}

console.log(solve(input));
