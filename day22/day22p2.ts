// --- Part Two ---
// Disintegrating bricks one at a time isn't going to be fast enough. While it might sound dangerous, what you really need is a chain reaction.

// You'll need to figure out the best brick to disintegrate. For each brick, determine how many other bricks would fall if that brick were disintegrated.

// Using the same example as above:

// Disintegrating brick A would cause all 6 other bricks to fall.
// Disintegrating brick F would cause only 1 other brick, G, to fall.
// Disintegrating any other brick would cause no other bricks to fall. So, in this example, the sum of the number of other bricks that would fall as a result of disintegrating each brick is 7.

// For each brick, determine how many other bricks would fall if that brick were disintegrated. What is the sum of the number of other bricks that would fall?

import * as fs from 'fs';

const input: string = fs.readFileSync('day22/day22_input.txt', 'utf8');

const parseGraphWithSettledBricks = (input: string): [Map<string, number>, number[][][]] => {
    const bricks: number[][][] = input.split('\n').map((line: string) => line.split('~').map((s: string) => s.split(',').map((s: string) => parseInt(s))));
    const graph: Map<string, number> = new Map<string, number>();
    bricks.forEach((brick: number[][], index: number) => {
        for(let x = Math.min(brick[0][0], brick[1][0]); x <= Math.max(brick[0][0], brick[1][0]); x++) 
            for(let y = Math.min(brick[0][1], brick[1][1]); y <= Math.max(brick[0][1], brick[1][1]); y++) 
                for(let z = Math.min(brick[0][2], brick[1][2]); z <= Math.max(brick[0][2], brick[1][2]); z++) 
                    graph.set(`${x},${y},${z}`, index);
    });
    let bricksFalling: boolean = true;
    while(bricksFalling) {
        bricksFalling = false;
        bricks.forEach((brick: number[][], index: number) => {
            let falling: boolean = true;
            for(let x = Math.min(brick[0][0], brick[1][0]); x <= Math.max(brick[0][0], brick[1][0]); x++) {
                for(let y = Math.min(brick[0][1], brick[1][1]); y <= Math.max(brick[0][1], brick[1][1]); y++) {
                    for(let z = Math.min(brick[0][2], brick[1][2]); z <= Math.max(brick[0][2], brick[1][2]); z++) {
                        if(z - 1 <= 0) falling = false;
                        else {
                            const below: number | undefined = graph.get(`${x},${y},${z - 1}`);
                            if(below !== undefined && below !== index) falling = false;
                        }
                    }
                }
            }
            if(falling) {
                bricksFalling = true;
                for(let x = Math.min(brick[0][0], brick[1][0]); x <= Math.max(brick[0][0], brick[1][0]); x++) 
                    for(let y = Math.min(brick[0][1], brick[1][1]); y <= Math.max(brick[0][1], brick[1][1]); y++) 
                        for(let z = Math.min(brick[0][2], brick[1][2]); z <= Math.max(brick[0][2], brick[1][2]); z++) 
                            graph.delete(`${x},${y},${z}`);
                bricks[index][0][2]--, bricks[index][1][2]--;
                for(let x = Math.min(brick[0][0], brick[1][0]); x <= Math.max(brick[0][0], brick[1][0]); x++) 
                    for(let y = Math.min(brick[0][1], brick[1][1]); y <= Math.max(brick[0][1], brick[1][1]); y++) 
                        for(let z = Math.min(brick[0][2], brick[1][2]); z <= Math.max(brick[0][2], brick[1][2]); z++)
                            graph.set(`${x},${y},${z}`, index);
            }
        });
    }
    return [graph, bricks];
}

const getTotalFalls = (removed: Set<number>, brick: number, bricksAbove: Map<number, Set<number>>, bricksBelow: Map<number, Set<number>>): number => {
    let falls: number = 0;
    for(const brickAbove of bricksAbove.get(brick)!) {
        const below = [...bricksBelow.get(brickAbove)!];
        if(below.every((b: number) => removed.has(b))) {
            removed.add(brickAbove);
            falls += getTotalFalls(removed, brickAbove, bricksAbove, bricksBelow) + 1;
        }
    }
    return falls;
}

const solve = (input: string): number => {
    const [graph, bricks] = parseGraphWithSettledBricks(input);
    const bricksAbove: Map<number, Set<number>> = new Map<number, Set<number>>();
    const bricksBelow: Map<number, Set<number>> = new Map<number, Set<number>>();
    bricks.forEach((brick: number[][], index: number) => {
        if(!bricksAbove.has(index)) bricksAbove.set(index, new Set());
        for(let x = Math.min(brick[0][0], brick[1][0]); x <= Math.max(brick[0][0], brick[1][0]); x++) {
            for(let y = Math.min(brick[0][1], brick[1][1]); y <= Math.max(brick[0][1], brick[1][1]); y++) {
                for(let z = Math.min(brick[0][2], brick[1][2]); z <= Math.max(brick[0][2], brick[1][2]); z++) {
                    const above: number | undefined = graph.get(`${x},${y},${z + 1}`);
                    if(above !== undefined && above !== index) {
                        bricksAbove.get(index)!.add(above);
                        if(!bricksBelow.has(above)) bricksBelow.set(above, new Set());
                        bricksBelow.get(above)!.add(index);
                    }
                }
            }
        }
    });
    return bricks.map((_: number[][], index: number) => getTotalFalls(new Set([index]), index, bricksAbove, bricksBelow))
        .reduce((a: number, b: number) => a + b, 0);
};

console.log(solve(input));
