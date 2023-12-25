// --- Day 24: Never Tell Me The Odds ---
// It seems like something is going wrong with the snow-making process. Instead of forming snow, the water that's been absorbed into the air seems to be forming hail!

// Maybe there's something you can do to break up the hailstones?

// Due to strong, probably-magical winds, the hailstones are all flying through the air in perfectly linear trajectories. You make a note of each hailstone's position and velocity (your puzzle input). For example:

// 19, 13, 30 @ -2,  1, -2
// 18, 19, 22 @ -1, -1, -2
// 20, 25, 34 @ -2, -2, -4
// 12, 31, 28 @ -1, -2, -1
// 20, 19, 15 @  1, -5, -3
// Each line of text corresponds to the position and velocity of a single hailstone. The positions indicate where the hailstones are right now (at time 0). The velocities are constant and indicate exactly how far each hailstone will move in one nanosecond.

// Each line of text uses the format px py pz @ vx vy vz. For instance, the hailstone specified by 20, 19, 15 @ 1, -5, -3 has initial X position 20, Y position 19, Z position 15, X velocity 1, Y velocity -5, and Z velocity -3. After one nanosecond, the hailstone would be at 21, 14, 12.

// Perhaps you won't have to do anything. How likely are the hailstones to collide with each other and smash into tiny ice crystals?

// To estimate this, consider only the X and Y axes; ignore the Z axis. Looking forward in time, how many of the hailstones' paths will intersect within a test area? (The hailstones themselves don't have to collide, just test for intersections between the paths they will trace.)

// In this example, look for intersections that happen with an X and Y position each at least 7 and at most 27; in your actual data, you'll need to check a much larger test area. Comparing all pairs of hailstones' future paths produces the following results:

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 18, 19, 22 @ -1, -1, -2
// Hailstones' paths will cross inside the test area (at x=14.333, y=15.333).

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 20, 25, 34 @ -2, -2, -4
// Hailstones' paths will cross inside the test area (at x=11.667, y=16.667).

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 12, 31, 28 @ -1, -2, -1
// Hailstones' paths will cross outside the test area (at x=6.2, y=19.4).

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 20, 19, 15 @ 1, -5, -3
// Hailstones' paths crossed in the past for hailstone A.

// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 20, 25, 34 @ -2, -2, -4
// Hailstones' paths are parallel; they never intersect.

// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 12, 31, 28 @ -1, -2, -1
// Hailstones' paths will cross outside the test area (at x=-6, y=-5).

// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 20, 19, 15 @ 1, -5, -3
// Hailstones' paths crossed in the past for both hailstones.

// Hailstone A: 20, 25, 34 @ -2, -2, -4
// Hailstone B: 12, 31, 28 @ -1, -2, -1
// Hailstones' paths will cross outside the test area (at x=-2, y=3).

// Hailstone A: 20, 25, 34 @ -2, -2, -4
// Hailstone B: 20, 19, 15 @ 1, -5, -3
// Hailstones' paths crossed in the past for hailstone B.

// Hailstone A: 12, 31, 28 @ -1, -2, -1
// Hailstone B: 20, 19, 15 @ 1, -5, -3
// Hailstones' paths crossed in the past for both hailstones.
// So, in this example, 2 hailstones' future paths cross inside the boundaries of the test area.

// However, you'll need to search a much larger test area if you want to see if any hailstones might collide. Look for intersections that happen with an X and Y position each at least 200000000000000 and at most 400000000000000. Disregard the Z axis entirely.

// Considering only the X and Y axes, check all pairs of hailstones' future paths for intersections. How many of these intersections occur within the test area?

import * as fs from 'fs';

const input: string = fs.readFileSync('day24/day24_input.txt', 'utf8');

const intersect = (stone1: number[][], stone2: number[][], shift: number[] = [0, 0], coordinates: number[] = [0, 1]): {x: number, y: number} | null => {
    const x1: number = stone1[0][coordinates[0]]; 
    const y1: number = stone1[0][coordinates[1]];
    const x2: number = x1 + stone1[1][coordinates[0]] - shift[0];
    const y2: number = y1 + stone1[1][coordinates[1]] - shift[1];
    const x3: number = stone2[0][coordinates[0]];
    const y3: number = stone2[0][coordinates[1]];
    const x4: number = x3 + stone2[1][coordinates[0]] - shift[0];
    const y4: number = y3 + stone2[1][coordinates[1]] - shift[1];
    const denominator: number = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    if(denominator === 0) return null;
    const scaling: number = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
    return {x: x1 + (scaling * (x2 - x1)), y: y1 + (scaling * (y2 - y1))};
}

const solve = (input: string): number => {
    const hailstones: number[][][] = input.split('\n')
        .map((line: string) => line.split('@'))
        .map((line: string[]) => line.map((line: string) => line.trim().split(', ')))
        .map((line: string[][]) => line.map((s: string[]) => s.map(Number)));
    const MINIMUM = 200000000000000, MAXIMUM = 400000000000000;
    let result: number = 0;
    for(let indexOne = 0; indexOne < hailstones.length; indexOne++) {
        const [x1, y1] = hailstones[indexOne][0];
        for(let indexTwo = indexOne + 1; indexTwo < hailstones.length; indexTwo++) {
            const [x3, y3] = hailstones[indexTwo][0];
            const intersection: {x: number, y: number} | null = intersect(hailstones[indexOne], hailstones[indexTwo]);
            if(intersection) {
                const [x, y] = [intersection.x, intersection.y];
                if(x - x1 > 0 !== hailstones[indexOne][1][0] > 0) continue;
                if(y - y1 > 0 !== hailstones[indexOne][1][1] > 0) continue;
                if(x - x3 > 0 !== hailstones[indexTwo][1][0] > 0) continue;
                if(y - y3 > 0 !== hailstones[indexTwo][1][1] > 0) continue;
                if(MINIMUM <= x && x <= MAXIMUM && MINIMUM <= y && y <= MAXIMUM) result++;
            }
        }
    }
    return result;
};

console.log(solve(input));
