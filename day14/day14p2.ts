// --- Part Two ---
// The parabolic reflector dish deforms, but not in a way that focuses the beam. To do that, you'll need to move the rocks to the edges of the platform. Fortunately, a button on the side of the control panel labeled "spin cycle" attempts to do just that!

// Each cycle tilts the platform four times so that the rounded rocks roll north, then west, then south, then east. After each tilt, the rounded rocks roll as far as they can before the platform tilts in the next direction. After one cycle, the platform will have finished rolling the rounded rocks in those four directions in that order.

// Here's what happens in the example above after each of the first few cycles:

// After 1 cycle:
// .....#....
// ....#...O#
// ...OO##...
// .OO#......
// .....OOO#.
// .O#...O#.#
// ....O#....
// ......OOOO
// #...O###..
// #..OO#....

// After 2 cycles:
// .....#....
// ....#...O#
// .....##...
// ..O#......
// .....OOO#.
// .O#...O#.#
// ....O#...O
// .......OOO
// #..OO###..
// #.OOO#...O

// After 3 cycles:
// .....#....
// ....#...O#
// .....##...
// ..O#......
// .....OOO#.
// .O#...O#.#
// ....O#...O
// .......OOO
// #...O###.O
// #.OOO#...O
// This process should work if you leave it running long enough, but you're still worried about the north support beams. To make sure they'll survive for a while, you need to calculate the total load on the north support beams after 1000000000 cycles.

// In the above example, after 1000000000 cycles, the total load on the north support beams is 64.

// Run the spin cycle for 1000000000 cycles. Afterward, what is the total load on the north support beams?

import * as fs from 'fs';

const input: string = fs.readFileSync('day14/day14_input.txt', 'utf8');
const TOTAL_CYCLES = 1e9;

const tilt = (graph: string[][], dx: number, dy: number): string[][] => {
    for(let row: number = dx === 1 ? graph.length - 1 : 0; 0 <= row && row < graph.length; row += (dx != 0 ? -dx : 1)) {
        for(let col: number = dy === 1 ? graph[row].length - 1 : 0; 0 <= col && col < graph[row].length; col += (dy != 0 ? -dy : 1)) {
            if(graph[row][col] === 'O') {
                let [x, y] = [row, col];
                while(0 <= x + dx && x + dx < graph.length && 0 <= y + dy && y + dy < graph[x + dx].length && graph[x + dx][y + dy] === '.') {
                    x += dx;
                    y += dy;
                }
                graph[row][col] = '.';
                graph[x][y] = 'O';
            }
        }
    }
    return graph;
}

const solve = (input: string): number => {
    let graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    const previousStates: Map<string, number> = new Map<string, number>();
    for(let spinCycles = 0; spinCycles < TOTAL_CYCLES; spinCycles++) {
        const graphState: string = graph.map((line: string[]) => line.join('')).join('\n');
        if(previousStates.has(graphState)) {
            const stateCycleLength: number = spinCycles - previousStates.get(graphState)!;
            const remainingSpinCycles: number = TOTAL_CYCLES - spinCycles;
            spinCycles += Math.floor(remainingSpinCycles / stateCycleLength) * stateCycleLength;
        }
        previousStates.set(graphState, spinCycles);
        graph = tilt(tilt(tilt(tilt(graph, -1, 0), 0, -1), 1, 0), 0, 1);
    }
    let result: number = 0;
    for(let row: number = 0; row < graph.length; row++) {
        for(let col: number = 0; col < graph[row].length; col++) { 
            if(graph[row][col] === 'O') result += graph.length - row;
        }
    }
    return result;
}

console.log(solve(input));
