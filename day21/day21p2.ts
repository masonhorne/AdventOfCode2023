// --- Part Two ---
// The Elf seems confused by your answer until he realizes his mistake: he was reading from a list of his favorite numbers that are both perfect squares and perfect cubes, not his step counter.

// The actual number of steps he needs to get today is exactly 26501365.

// He also points out that the garden plots and rocks are set up so that the map repeats infinitely in every direction.

// So, if you were to look one additional map-width or map-height out from the edge of the example map above, you would find that it keeps repeating:

// .................................
// .....###.#......###.#......###.#.
// .###.##..#..###.##..#..###.##..#.
// ..#.#...#....#.#...#....#.#...#..
// ....#.#........#.#........#.#....
// .##...####..##...####..##...####.
// .##..#...#..##..#...#..##..#...#.
// .......##.........##.........##..
// .##.#.####..##.#.####..##.#.####.
// .##..##.##..##..##.##..##..##.##.
// .................................
// .................................
// .....###.#......###.#......###.#.
// .###.##..#..###.##..#..###.##..#.
// ..#.#...#....#.#...#....#.#...#..
// ....#.#........#.#........#.#....
// .##...####..##..S####..##...####.
// .##..#...#..##..#...#..##..#...#.
// .......##.........##.........##..
// .##.#.####..##.#.####..##.#.####.
// .##..##.##..##..##.##..##..##.##.
// .................................
// .................................
// .....###.#......###.#......###.#.
// .###.##..#..###.##..#..###.##..#.
// ..#.#...#....#.#...#....#.#...#..
// ....#.#........#.#........#.#....
// .##...####..##...####..##...####.
// .##..#...#..##..#...#..##..#...#.
// .......##.........##.........##..
// .##.#.####..##.#.####..##.#.####.
// .##..##.##..##..##.##..##..##.##.
// .................................
// This is just a tiny three-map-by-three-map slice of the inexplicably-infinite farm layout; garden plots and rocks repeat as far as you can see. The Elf still starts on the one middle tile marked S, though - every other repeated S is replaced with a normal garden plot (.).

// Here are the number of reachable garden plots in this new infinite version of the example map for different numbers of steps:

// In exactly 6 steps, he can still reach 16 garden plots.
// In exactly 10 steps, he can reach any of 50 garden plots.
// In exactly 50 steps, he can reach 1594 garden plots.
// In exactly 100 steps, he can reach 6536 garden plots.
// In exactly 500 steps, he can reach 167004 garden plots.
// In exactly 1000 steps, he can reach 668697 garden plots.
// In exactly 5000 steps, he can reach 16733044 garden plots.
// However, the step count the Elf needs is much larger! Starting from the garden plot marked S on your infinite map, how many garden plots could the Elf reach in exactly 26501365 steps?

import * as fs from 'fs';

const input: string = fs.readFileSync('day21/day21_input.txt', 'utf8');

const getTruePosition = (row: number, col: number, totalRows: number, totalCols: number): number[] => {
    const getTrueValue = (value: number, totalValue: number): number => {
        let trueValue: number = value;
        while(trueValue < 0) trueValue += totalValue;
        if(trueValue >= totalValue) trueValue %= totalValue;
        return trueValue;
    }
    return [getTrueValue(row, totalRows), getTrueValue(col, totalCols)];
}

const quadraticPolynomial = (a: number, b: number, c: number, steps: number): number => {
    return (a - b) * Math.floor((steps * (steps - 1) / 2)) + b * steps + c;
}

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
    const goalSteps: number = 26501365;
    const dataPoints: number[] = [];
    for(let step: number = 1; step <= goalSteps && dataPoints.length < 3; step++) {
        const nextQueue: Set<string> = new Set<string>();
        while(queue.size > 0) {
            const [row, col] = queue.values().next().value.split(',').map((s: string) => parseInt(s));
            queue.delete(`${row},${col}`);
            const [trueRow, trueCol] = getTruePosition(row, col, totalRows, totalCols);
            if(trueRow > 0 && g[trueRow - 1][trueCol] !== '#') nextQueue.add(`${row - 1},${col}`);
            if(trueRow === 0 && g[totalRows - 1][trueCol] !== '#') nextQueue.add(`${row - 1},${col}`);
            if(trueRow < totalRows - 1 && g[trueRow + 1][trueCol] !== '#') nextQueue.add(`${row + 1},${col}`);
            if(trueRow === totalRows - 1 && g[0][trueCol] !== '#') nextQueue.add(`${row + 1},${col}`);
            if(trueCol > 0 && g[trueRow][trueCol - 1] !== '#') nextQueue.add(`${row},${col - 1}`);
            if(trueCol === 0 && g[trueRow][totalCols - 1] !== '#') nextQueue.add(`${row},${col - 1}`);
            if(trueCol < totalCols - 1 && g[trueRow][trueCol + 1] !== '#') nextQueue.add(`${row},${col + 1}`);
            if(trueCol === totalCols - 1 && g[trueRow][0] !== '#') nextQueue.add(`${row},${col + 1}`);
        }
        queue = nextQueue;
        if(step % totalRows === goalSteps % totalRows) dataPoints.push(queue.size);
    }
    return quadraticPolynomial(dataPoints[2] - dataPoints[1], dataPoints[1] - dataPoints[0], dataPoints[0], Math.floor(goalSteps / totalRows));
};

console.log(solve(input));
