// --- Day 23: A Long Walk ---
// The Elves resume water filtering operations! Clean water starts flowing over the edge of Island Island.

// They offer to help you go over the edge of Island Island, too! Just hold on tight to one end of this impossibly long rope and they'll lower you down a safe distance from the massive waterfall you just created.

// As you finally reach Snow Island, you see that the water isn't really reaching the ground: it's being absorbed by the air itself. It looks like you'll finally have a little downtime while the moisture builds up to snow-producing levels. Snow Island is pretty scenic, even without any snow; why not take a walk?

// There's a map of nearby hiking trails (your puzzle input) that indicates paths (.), forest (#), and steep slopes (^, >, v, and <).

// For example:

// #.#####################
// #.......#########...###
// #######.#########.#.###
// ###.....#.>.>.###.#.###
// ###v#####.#v#.###.#.###
// ###.>...#.#.#.....#...#
// ###v###.#.#.#########.#
// ###...#.#.#.......#...#
// #####.#.#.#######.#.###
// #.....#.#.#.......#...#
// #.#####.#.#.#########v#
// #.#...#...#...###...>.#
// #.#.#v#######v###.###v#
// #...#.>.#...>.>.#.###.#
// #####v#.#.###v#.#.###.#
// #.....#...#...#.#.#...#
// #.#########.###.#.#.###
// #...###...#...#...#.###
// ###.###.#.###v#####v###
// #...#...#.#.>.>.#.>.###
// #.###.###.#.###.#.#v###
// #.....###...###...#...#
// #####################.#
// You're currently on the single path tile in the top row; your goal is to reach the single path tile in the bottom row. Because of all the mist from the waterfall, the slopes are probably quite icy; if you step onto a slope tile, your next step must be downhill (in the direction the arrow is pointing). To make sure you have the most scenic hike possible, never step onto the same tile twice. What is the longest hike you can take?

// In the example above, the longest hike you can take is marked with O, and your starting position is marked S:

// #S#####################
// #OOOOOOO#########...###
// #######O#########.#.###
// ###OOOOO#OOO>.###.#.###
// ###O#####O#O#.###.#.###
// ###OOOOO#O#O#.....#...#
// ###v###O#O#O#########.#
// ###...#O#O#OOOOOOO#...#
// #####.#O#O#######O#.###
// #.....#O#O#OOOOOOO#...#
// #.#####O#O#O#########v#
// #.#...#OOO#OOO###OOOOO#
// #.#.#v#######O###O###O#
// #...#.>.#...>OOO#O###O#
// #####v#.#.###v#O#O###O#
// #.....#...#...#O#O#OOO#
// #.#########.###O#O#O###
// #...###...#...#OOO#O###
// ###.###.#.###v#####O###
// #...#...#.#.>.>.#.>O###
// #.###.###.#.###.#.#O###
// #.....###...###...#OOO#
// #####################O#
// This hike contains 94 steps. (The other possible hikes you could have taken were 90, 86, 82, 82, and 74 steps long.)

// Find the longest hike you can take through the hiking trails listed on your map. How many steps long is the longest hike?

import * as fs from 'fs';
import { PriorityQueue } from '../ds';

const input: string = fs.readFileSync('day23/day23_input.txt', 'utf8');

const solve = (input: string): number => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    let startX: number = 0, startY: number = graph[0].indexOf('.');
    let result: number = 0;
    const priorityQueue = new PriorityQueue<any[]>((a: number[], b: number[]) => a[2] < b[2] ? -1 : 1);
    priorityQueue.push([startX, startY, 0, new Set<string>()]);
    while(!priorityQueue.isEmpty()) {
        const [x, y, d, path] = priorityQueue.pop()!;
        if(x < 0 || y < 0 || x >= graph.length || y >= graph[0].length || graph[x][y] === '#' || path.has(`${x},${y}`)) continue;
        if(x === graph.length - 1) result = Math.max(result, d);
        path.add(`${x},${y}`);
        if(graph[x][y] === '>') {
            priorityQueue.push([x, y + 1, d + 1, new Set(path)]);
        }
        if(graph[x][y] === '<') {
            priorityQueue.push([x, y - 1, d + 1, new Set(path)]);
        }
        if(graph[x][y] === '^') {
            priorityQueue.push([x - 1, y, d + 1, new Set(path)]);
        }
        if(graph[x][y] === 'v') {
            priorityQueue.push([x + 1, y, d + 1, new Set(path)]);
        }
        if(graph[x][y] === '.') {
            priorityQueue.push([x + 1, y, d + 1, new Set(path)]);
            priorityQueue.push([x - 1, y, d + 1, new Set(path)]);
            priorityQueue.push([x, y + 1, d + 1, new Set(path)]);
            priorityQueue.push([x, y - 1, d + 1, new Set(path)]);
        }
    }
    return result;
};

console.log(solve(input));
