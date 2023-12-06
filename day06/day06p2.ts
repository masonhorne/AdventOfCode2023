// --- Part Two ---
// As the race is about to start, you realize the piece of paper with race times and record distances you got earlier actually just has very bad kerning. There's really only one race - ignore the spaces between the numbers on each line.

// So, the example from before:

// Time:      7  15   30
// Distance:  9  40  200
// ...now instead means this:

// Time:      71530
// Distance:  940200
// Now, you have to figure out how many ways there are to win this single race. In this example, the race lasts for 71530 milliseconds and the record distance you need to beat is 940200 millimeters. You could hold the button anywhere from 14 to 71516 milliseconds and beat the record, a total of 71503 ways!

// How many ways can you beat the record in this one much longer race?

import * as fs from 'fs';

const input: string = fs.readFileSync('day06/day06_input.txt', 'utf8');

const findRoot = (a: number, b: number, c: number, isPlus: boolean): number => {
    return (-b + (isPlus ? 1 : -1) * Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
}

const totalSolutions = (timeAllowed: number, distance: number): number => {
    const boundOne: number = Math.floor(findRoot(-1, timeAllowed, -distance, true)) + 1;
    const boundTwo: number = Math.ceil(findRoot(-1, timeAllowed, -distance, false)) - 1;
    return Math.abs(boundTwo - boundOne) + 1;
};

const solve = (input: string): number => {
    const [time, distance] = input.split('\n').map((line: string) => Number(line.split(' ').slice(1).filter((val) => val != '').join('')));
    return totalSolutions(time, distance)
};

console.log(solve(input));
