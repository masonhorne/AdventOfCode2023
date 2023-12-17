// --- Part Two ---
// The crucibles of lava simply aren't large enough to provide an adequate supply of lava to the machine parts factory. Instead, the Elves are going to upgrade to ultra crucibles.

// Ultra crucibles are even more difficult to steer than normal crucibles. Not only do they have trouble going in a straight line, but they also have trouble turning!

// Once an ultra crucible starts moving in a direction, it needs to move a minimum of four blocks in that direction before it can turn (or even before it can stop at the end). However, it will eventually start to get wobbly: an ultra crucible can move a maximum of ten consecutive blocks without turning.

// In the above example, an ultra crucible could follow this path to minimize heat loss:

// 2>>>>>>>>1323
// 32154535v5623
// 32552456v4254
// 34465858v5452
// 45466578v>>>>
// 143859879845v
// 445787698776v
// 363787797965v
// 465496798688v
// 456467998645v
// 122468686556v
// 254654888773v
// 432267465553v
// In the above example, an ultra crucible would incur the minimum possible heat loss of 94.

// Here's another example:

// 111111111111
// 999999999991
// 999999999991
// 999999999991
// 999999999991
// Sadly, an ultra crucible would need to take an unfortunate path like this one:

// 1>>>>>>>1111
// 9999999v9991
// 9999999v9991
// 9999999v9991
// 9999999v>>>>
// This route causes the ultra crucible to incur the minimum possible heat loss of 71.

// Directing the ultra crucible from the lava pool to the machine parts factory, what is the least heat loss it can incur?

import * as fs from 'fs';
import { PriorityQueue } from '../ds';

const input: string = fs.readFileSync('day17/day17_input.txt', 'utf8');

const dijkstra = (graph: string[][], startRow: number, startCol: number, endRow: number, endCol: number): number => {
    const heap: PriorityQueue<number[]> = new PriorityQueue<number[]>((a, b) => a[2] < b[2] ? -1 : 1);
    heap.push([startRow, startCol + 1, 0, 0, 1, 1]);
    heap.push([startRow + 1, startCol, 0, 1, 0, 1]);
    const visitedStates: Set<string> = new Set();
    while(heap.size() > 0) {
        const [x, y, distance, dx, dy, repeat] = heap.pop()!;
        const key: string = `${x},${y},${dx},${dy},${repeat}`;
        if(x < 0 || y < 0 || x >= graph.length || y >= graph[0].length) continue;
        const newDistance: number = distance + Number(graph[x][y]);
        if(x === endRow && y === endCol && repeat >= 4) return newDistance;
        if(visitedStates.has(key)) continue;
        visitedStates.add(key);
        if(!(repeat >= 10 && dx === -1) && (repeat >= 4 || dx == -1) && (dy !== 0 || dx === -1)) {
            const newRepeat: number = dx === -1 ? repeat + 1 : 1;
            heap.push([x - 1, y, newDistance, -1, 0, newRepeat]);
        }
        if(!(repeat >= 10 && dy === -1) && (repeat >= 4 || dy === -1) && (dx !== 0 || dy === -1)) {
            const newRepeat: number = dy === -1 ? repeat + 1 : 1;
            heap.push([x, y - 1, newDistance, 0, -1, newRepeat]);
        }
        if(!(repeat >= 10 && dx === 1) && (repeat >= 4 || dx === 1) && (dy !== 0 || dx === 1)) {
            const newRepeat: number = dx === 1 ? repeat + 1 : 1;
            heap.push([x + 1, y, newDistance, 1, 0, newRepeat]);
        }
        if(!(repeat >= 10 && dy === 1) && (repeat >= 4 || dy === 1) && (dx !== 0 || dy === 1)) {
            const newRepeat: number = dy === 1 ? repeat + 1 : 1;
            heap.push([x, y + 1, newDistance, 0, 1, newRepeat]);
        }
    }
    return -1;
}

const solve = (input: string): number => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    return dijkstra(graph, 0, 0, graph.length - 1, graph[0].length - 1);
}

console.log(solve(input));
