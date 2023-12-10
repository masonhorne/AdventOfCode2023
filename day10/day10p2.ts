// --- Part Two ---
// You quickly reach the farthest point of the loop, but the animal never emerges. Maybe its nest is within the area enclosed by the loop?

// To determine whether it's even worth taking the time to search for such a nest, you should calculate how many tiles are contained within the loop. For example:

// ...........
// .S-------7.
// .|F-----7|.
// .||.....||.
// .||.....||.
// .|L-7.F-J|.
// .|..|.|..|.
// .L--J.L--J.
// ...........
// The above loop encloses merely four tiles - the two pairs of . in the southwest and southeast (marked I below). The middle . tiles (marked O below) are not in the loop. Here is the same loop again with those regions marked:

// ...........
// .S-------7.
// .|F-----7|.
// .||OOOOO||.
// .||OOOOO||.
// .|L-7OF-J|.
// .|II|O|II|.
// .L--JOL--J.
// .....O.....
// In fact, there doesn't even need to be a full tile path to the outside for tiles to count as outside the loop - squeezing between pipes is also allowed! Here, I is still within the loop and O is still outside the loop:

// ..........
// .S------7.
// .|F----7|.
// .||OOOO||.
// .||OOOO||.
// .|L-7F-J|.
// .|II||II|.
// .L--JL--J.
// ..........
// In both of the above examples, 4 tiles are enclosed by the loop.

// Here's a larger example:

// .F----7F7F7F7F-7....
// .|F--7||||||||FJ....
// .||.FJ||||||||L7....
// FJL7L7LJLJ||LJ.L-7..
// L--J.L7...LJS7F-7L7.
// ....F-J..F7FJ|L7L7L7
// ....L7.F7||L7|.L7L7|
// .....|FJLJ|FJ|F7|.LJ
// ....FJL-7.||.||||...
// ....L---J.LJ.LJLJ...
// The above sketch has many random bits of ground, some of which are in the loop (I) and some of which are outside it (O):

// OF----7F7F7F7F-7OOOO
// O|F--7||||||||FJOOOO
// O||OFJ||||||||L7OOOO
// FJL7L7LJLJ||LJIL-7OO
// L--JOL7IIILJS7F-7L7O
// OOOOF-JIIF7FJ|L7L7L7
// OOOOL7IF7||L7|IL7L7|
// OOOOO|FJLJ|FJ|F7|OLJ
// OOOOFJL-7O||O||||OOO
// OOOOL---JOLJOLJLJOOO
// In this larger example, 8 tiles are enclosed by the loop.

// Any tile that isn't part of the main loop can count as being enclosed by the loop. Here's another example with many bits of junk pipe lying around that aren't connected to the main loop at all:

// FF7FSF7F7F7F7F7F---7
// L|LJ||||||||||||F--J
// FL-7LJLJ||||||LJL-77
// F--JF--7||LJLJ7F7FJ-
// L---JF-JLJ.||-FJLJJ7
// |F|F-JF---7F7-L7L|7|
// |FFJF7L7F-JF7|JL---7
// 7-L-JL7||F7|L7F-7F7|
// L.L7LFJ|||||FJL7||LJ
// L7JLJL-JLJLJL--JLJ.L
// Here are just the tiles that are enclosed by the loop marked with I:

// FF7FSF7F7F7F7F7F---7
// L|LJ||||||||||||F--J
// FL-7LJLJ||||||LJL-77
// F--JF--7||LJLJIF7FJ-
// L---JF-JLJIIIIFJLJJ7
// |F|F-JF---7IIIL7L|7|
// |FFJF7L7F-JF7IIL---7
// 7-L-JL7||F7|L7F-7F7|
// L.L7LFJ|||||FJL7||LJ
// L7JLJL-JLJLJL--JLJ.L
// In this last example, 10 tiles are enclosed by the loop.

// Figure out whether you have time to search for the nest by calculating the area within the loop. How many tiles are enclosed by the loop?

import * as fs from 'fs';

const input: string = fs.readFileSync('day10/day10_input.txt', 'utf8');

const opensUp = (character: string): boolean => character === '|' || character === 'J' || character === 'L' || character === 'S';
const opensDown = (character: string): boolean => character === '|' || character === 'F' || character === '7' || character === 'S';
const opensLeft = (character: string): boolean => character === '-' || character === '7' || character === 'J' || character === 'S';
const opensRight = (character: string): boolean => character === '-' || character === 'F' || character === 'L' || character === 'S';
const isBendPipe = (character: string): boolean => character === '7' || character === 'J' || character === 'L' || character === 'F';

const validPipe = (x: number, y: number, graph: string[][], moveType: (character: string) => boolean): boolean => {
    if(x < 0 || y < 0 || x >= graph.length || y >= graph[0].length) return false;
    return moveType(graph[x][y]);
}

const getPipeCycle = (startPosition: number[], graph: string[][]): Set<string> => {
    const cycle: Set<string> = new Set<string>();
    const stack: number[][] = [startPosition];
    while(stack.length > 0) {
        const [x, y] = stack.pop()!;
        if(x < 0 || y < 0 || x >= graph.length || y >= graph[0].length || graph[x][y] === '.' || cycle.has(`${x},${y}`)) continue;
        cycle.add(`${x},${y}`);
        const moveUp: boolean = opensUp(graph[x][y]) && validPipe(x - 1, y, graph, opensDown);
        const moveDown: boolean = opensDown(graph[x][y]) && validPipe(x + 1, y, graph, opensUp);
        const moveLeft: boolean = opensLeft(graph[x][y]) && validPipe(x, y - 1, graph, opensRight);
        const moveRight: boolean = opensRight(graph[x][y]) && validPipe(x, y + 1, graph, opensLeft);
        if(moveUp) stack.push([x - 1, y, x, y]);
        if(moveDown) stack.push([x + 1, y, x, y]);
        if(moveLeft) stack.push([x, y - 1, x, y]);
        if(moveRight) stack.push([x, y + 1, x, y]);
    }
    return cycle;
}

const countContainedTiles = (cycle: Set<string>, graph: string[][]): number => {
    let result: number = 0;
    for(let row: number = 0; row < graph.length; row++) {
        let cycleCrosses: number = 0;
        for(let col: number = 0; col < graph[row].length; col++) {
            if(!cycle.has(`${row},${col}`)) result += cycleCrosses % 2;
            if(cycle.has(`${row},${col}`)) {
                const start: string = graph[row][col];
                if(start === '|') cycleCrosses++;
                else {
                    const initialRow: number = row;
                    const initialCol: number = col;
                    while((row === initialRow && col === initialCol) || !isBendPipe(graph[row][col])) col++;
                    if(start === 'F' && graph[row][col] === '7') continue;
                    if(start === 'F' && graph[row][col] === 'S' && validPipe(row + 1, col, graph, opensUp)) continue;
                    if(start === 'S' && graph[row][col] === '7' && validPipe(row + 1, col, graph, opensUp)) continue;
                    if(start === 'L' && graph[row][col] === 'J') continue;
                    if(start === 'L' && graph[row][col] === 'S' && validPipe(row - 1, col, graph, opensDown)) continue;
                    if(start === 'S' && graph[row][col] === 'J' && validPipe(row - 1, col, graph, opensDown)) continue;
                    cycleCrosses++;
                }
            }
        }
    }
    return result;
}

const solve = (input: string): number => {
    const startPosition: number[] = [-1, -1];
    const graph: string[][] = input.split('\n').map((line: string, idx: number) => {
        const row: string[] = line.split('');
        if (row.indexOf('S') !== -1) {
            startPosition[0] = idx;
            startPosition[1] = row.indexOf('S');
        }
        return row;
    });
    const cycle: Set<string> = getPipeCycle(startPosition, graph);
    return countContainedTiles(cycle, graph);
};

console.log(solve(input));
