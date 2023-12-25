// --- Part Two ---
// Upon further analysis, it doesn't seem like any hailstones will naturally collide. It's up to you to fix that!

// You find a rock on the ground nearby. While it seems extremely unlikely, if you throw it just right, you should be able to hit every hailstone in a single throw!

// You can use the probably-magical winds to reach any integer position you like and to propel the rock at any integer velocity. Now including the Z axis in your calculations, if you throw the rock at time 0, where do you need to be so that the rock perfectly collides with every hailstone? Due to probably-magical inertia, the rock won't slow down or change direction when it collides with a hailstone.

// In the example above, you can achieve this by moving to position 24, 13, 10 and throwing the rock at velocity -3, 1, 2. If you do this, you will hit every hailstone as follows:

// Hailstone: 19, 13, 30 @ -2, 1, -2
// Collision time: 5
// Collision position: 9, 18, 20

// Hailstone: 18, 19, 22 @ -1, -1, -2
// Collision time: 3
// Collision position: 15, 16, 16

// Hailstone: 20, 25, 34 @ -2, -2, -4
// Collision time: 4
// Collision position: 12, 17, 18

// Hailstone: 12, 31, 28 @ -1, -2, -1
// Collision time: 6
// Collision position: 6, 19, 22

// Hailstone: 20, 19, 15 @ 1, -5, -3
// Collision time: 1
// Collision position: 21, 14, 12
// Above, each hailstone is identified by its initial position and its velocity. Then, the time and position of that hailstone's collision with your rock are given.

// After 1 nanosecond, the rock has exactly the same position as one of the hailstones, obliterating it into ice dust! Another hailstone is smashed to bits two nanoseconds after that. After a total of 6 nanoseconds, all of the hailstones have been destroyed.

// So, at time 0, the rock needs to be at X position 24, Y position 13, and Z position 10. Adding these three coordinates together produces 47. (Don't add any coordinates from the rock's velocity.)

// Determine the exact position and velocity the rock needs to have at time 0 so that it perfectly collides with every hailstone. What do you get if you add up the X, Y, and Z coordinates of that initial position?

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

const getTime = (stone: number[][], intersect: number, shift: number, coordinate: number) => {
    return (intersect - stone[0][coordinate]) / (stone[1][coordinate] - shift);
}

const solve = (input: string): number => {
    const hailstones = input.split('\n')
        .map((line: string) => line.split('@'))
        .map((line: string[]) => line.map((line: string) => line.trim().split(', ')))
        .map((line: string[][]) => line.map((s: string[]) => s.map(Number)));
    const result: number[] = [0, 0];
    const minVelocity: number = -500, maxVelocity: number = 500;
    for(let xVelocity: number = minVelocity; xVelocity <= maxVelocity; xVelocity++) {
        for(let yVelocity: number = minVelocity; yVelocity <= maxVelocity; yVelocity++) {
            for(let zVelocity: number = minVelocity; zVelocity <= maxVelocity; zVelocity++) {
                let badVelocityCombination: boolean = false, totalIntersects = 0;
                for(let i = 0; i < hailstones.length; i++) {
                    for(let j = i + 1; j < hailstones.length; j++) {
                        let intersectXY: {x: number, y: number} | null = intersect(hailstones[i], hailstones[j], [xVelocity, yVelocity], [0, 1]);
                        let intersectYZ: {x: number, y: number} | null = intersect(hailstones[i], hailstones[j], [yVelocity, zVelocity], [1, 2]);
                        let intersectXZ: {x: number, y: number} | null = intersect(hailstones[i], hailstones[j], [xVelocity, zVelocity], [0, 2]);
                        let parallelVelocities: number = [intersectXY, intersectYZ, intersectXZ].filter((e: any) => e === null).length;
                        if(parallelVelocities > 2) badVelocityCombination = true;
                        if(badVelocityCombination) break;
                        let validIntersects: number = 0, xIntersectTime, yIntersectTime;
                        if(intersectXY) {
                            let stone1IntersectTime: number = getTime(hailstones[i], intersectXY.x, xVelocity, 0);
                            if(isNaN(stone1IntersectTime)) stone1IntersectTime = getTime(hailstones[i], intersectXY.y, yVelocity, 1);
                            let stone2IntersectTime: number = getTime(hailstones[j], intersectXY.x, xVelocity, 0);
                            if(isNaN(stone2IntersectTime)) stone2IntersectTime = getTime(hailstones[j], intersectXY.y, yVelocity, 1);
                            if(xIntersectTime === undefined) xIntersectTime = stone1IntersectTime;
                            if(yIntersectTime === undefined) yIntersectTime = stone2IntersectTime;
                            if(stone1IntersectTime > 0 && stone2IntersectTime > 0 && xIntersectTime === stone1IntersectTime && yIntersectTime === stone2IntersectTime) validIntersects++;
                        }
                        if(intersectYZ) {
                            let stone1IntersectTime: number = getTime(hailstones[i], intersectYZ.x, yVelocity, 1);
                            if(isNaN(stone1IntersectTime)) stone1IntersectTime = getTime(hailstones[i], intersectYZ.y, zVelocity, 2);
                            let stone2IntersectTime: number = getTime(hailstones[j], intersectYZ.x, yVelocity, 1);
                            if(isNaN(stone2IntersectTime)) stone2IntersectTime = getTime(hailstones[j], intersectYZ.y, zVelocity, 2);
                            if(xIntersectTime === undefined) xIntersectTime = stone1IntersectTime;
                            if(yIntersectTime === undefined) yIntersectTime = stone2IntersectTime;
                            if(stone1IntersectTime > 0 && stone2IntersectTime > 0 && xIntersectTime === stone1IntersectTime && yIntersectTime === stone2IntersectTime) validIntersects++;
                        }
                        if(intersectXZ) {
                            let stone1IntersectTime: number = getTime(hailstones[i], intersectXZ.x, xVelocity, 0);
                            if(isNaN(stone1IntersectTime)) stone1IntersectTime = getTime(hailstones[i], intersectXZ.y, zVelocity, 2);
                            let stone2IntersectTime: number = getTime(hailstones[j], intersectXZ.x, xVelocity, 0);
                            if(isNaN(stone2IntersectTime)) stone2IntersectTime = getTime(hailstones[j], intersectXZ.y, zVelocity, 2);
                            if(xIntersectTime === undefined) xIntersectTime = stone1IntersectTime;
                            if(yIntersectTime === undefined) yIntersectTime = stone2IntersectTime;
                            if(stone1IntersectTime > 0 && stone2IntersectTime > 0 && xIntersectTime === stone1IntersectTime && yIntersectTime === stone2IntersectTime) validIntersects++;
                        }
                        if(validIntersects < 2) badVelocityCombination = true;
                        if(badVelocityCombination) break;
                        totalIntersects++;
                        if(totalIntersects > result[0] && parallelVelocities === 0) {
                            result[0] = totalIntersects;
                            result[1] = [intersectXY!.x, intersectXY!.y, intersectYZ!.y].reduce((acc: number, value: number) => acc + value, 0);
                        }
                    }
                    if(badVelocityCombination) break;
                }
            }
        }
    }
    return result[1];
};

console.log(solve(input));
