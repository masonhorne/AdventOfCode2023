// --- Day 21: Step Counter ---
// You manage to catch the airship right as it's dropping someone else off on their all-expenses-paid trip to Desert Island! It even helpfully drops you off near the gardener and his massive farm.

// "You got the sand flowing again! Great work! Now we just need to wait until we have enough sand to filter the water for Snow Island and we'll have snow again in no time."

// While you wait, one of the Elves that works with the gardener heard how good you are at solving problems and would like your help. He needs to get his steps in for the day, and so he'd like to know which garden plots he can reach with exactly his remaining 64 steps.

// He gives you an up-to-date map (your puzzle input) of his starting position (S), garden plots (.), and rocks (#). For example:

// ...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........
// The Elf starts at the starting position (S) which also counts as a garden plot. Then, he can take one step north, south, east, or west, but only onto tiles that are garden plots. This would allow him to reach any of the tiles marked O:

// ...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#O#....
// .##.OS####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........
// Then, he takes a second step. Since at this point he could be at either tile marked O, his second step would allow him to reach any garden plot that is one step north, south, east, or west of any tile that he could have reached after the first step:

// ...........
// .....###.#.
// .###.##..#.
// ..#.#O..#..
// ....#.#....
// .##O.O####.
// .##.O#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........
// After two steps, he could be at any of the tiles marked O above, including the starting position (either by going north-then-south or by going west-then-east).

// A single third step leads to even more possibilities:

// ...........
// .....###.#.
// .###.##..#.
// ..#.#.O.#..
// ...O#O#....
// .##.OS####.
// .##O.#...#.
// ....O..##..
// .##.#.####.
// .##..##.##.
// ...........
// He will continue like this until his steps for the day have been exhausted. After a total of 6 steps, he could reach any of the garden plots marked O:

// ...........
// .....###.#.
// .###.##.O#.
// .O#O#O.O#..
// O.O.#.#.O..
// .##O.O####.
// .##.O#O..#.
// .O.O.O.##..
// .##.#.####.
// .##O.##.##.
// ...........
// In this example, if the Elf's goal was to get exactly 6 more steps today, he could use them to reach any of 16 garden plots.

// However, the Elf actually needs to get 64 steps today, and the map he's handed you is much larger than the example map.

// Starting from the garden plot marked S on your map, how many garden plots could the Elf reach in exactly 64 steps?

import * as fs from 'fs';

const input: string = fs.readFileSync('day21/day21_input.txt', 'utf8');

const solve = (input: string): number => {
    const startPosition: number[] = [0, 0];
    const g = input.split('\n').map((line: string, row: number) =>  {
        const characters: string[] = line.split('');
        const startColumn: number = characters.indexOf('S');
        if(startColumn !== -1) startPosition[0] = row, startPosition[1] = Number(startColumn);
        return characters;
    });
    const totalRows: number = g.length, totalCols: number = g[0].length;
    let queue: Set<string> = new Set();
    queue.add(`${startPosition[0]},${startPosition[1]}`);
    for(let step: number = 0; step < 64; step++) {
        const nextQueue: Set<string> = new Set<string>();
        while(queue.size > 0) {
            const [row, col] = queue.values().next().value.split(',').map((s: string) => parseInt(s));
            queue.delete(`${row},${col}`);
            if(row < 0 || col < 0 || row >= totalRows || col >= totalCols) continue;
            if(row > 0 && g[row - 1][col] !== '#') nextQueue.add(`${row - 1},${col}`);
            if(row < totalRows - 1 && g[row + 1][col] !== '#') nextQueue.add(`${row + 1},${col}`);
            if(col > 0 && g[row][col - 1] !== '#') nextQueue.add(`${row},${col - 1}`);
            if(col < totalCols - 1 && g[row][col + 1] !== '#') nextQueue.add(`${row},${col + 1}`);
        }
        queue = nextQueue;
    }
    return queue.size;
};

console.log(solve(input));
