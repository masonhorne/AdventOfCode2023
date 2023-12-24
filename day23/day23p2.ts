// --- Part Two ---
// As you reach the trailhead, you realize that the ground isn't as slippery as you expected; you'll have no problem climbing up the steep slopes.

// Now, treat all slopes as if they were normal paths (.). You still want to make sure you have the most scenic hike possible, so continue to ensure that you never step onto the same tile twice. What is the longest hike you can take?

// In the example above, this increases the longest hike to 154 steps:

// #S#####################
// #OOOOOOO#########OOO###
// #######O#########O#O###
// ###OOOOO#.>OOO###O#O###
// ###O#####.#O#O###O#O###
// ###O>...#.#O#OOOOO#OOO#
// ###O###.#.#O#########O#
// ###OOO#.#.#OOOOOOO#OOO#
// #####O#.#.#######O#O###
// #OOOOO#.#.#OOOOOOO#OOO#
// #O#####.#.#O#########O#
// #O#OOO#...#OOO###...>O#
// #O#O#O#######O###.###O#
// #OOO#O>.#...>O>.#.###O#
// #####O#.#.###O#.#.###O#
// #OOOOO#...#OOO#.#.#OOO#
// #O#########O###.#.#O###
// #OOO###OOO#OOO#...#O###
// ###O###O#O###O#####O###
// #OOO#OOO#O#OOO>.#.>O###
// #O###O###O#O###.#.#O###
// #OOOOO###OOO###...#OOO#
// #####################O#
// Find the longest hike you can take through the surprisingly dry hiking trails listed on your map. How many steps long is the longest hike?

import * as fs from 'fs';

const input: string = fs.readFileSync('day23/day23_input.txt', 'utf8');

const condenseGraph = (graph: string[][]): [Map<number, number[][]>, number] => {
    const findJunction = (cur: number[], prev: number[], d: number): number[] => {
        const paths: number[][] = [];
        if(cur[0] > 0 && graph[cur[0] - 1][cur[1]] !== '#') paths.push([cur[0] - 1, cur[1]]);
        if(cur[0] < graph.length - 1 && graph[cur[0] + 1][cur[1]] !== '#') paths.push([cur[0] + 1, cur[1]]);
        if(cur[1] > 0 && graph[cur[0]][cur[1] - 1] !== '#') paths.push([cur[0], cur[1] - 1]);
        if(cur[1] < graph[0].length - 1 && graph[cur[0]][cur[1] + 1] !== '#') paths.push([cur[0], cur[1] + 1]);
        if(paths.length === 2) {
            if(paths[0][0] === prev[0] && paths[0][1] === prev[1]) return findJunction(paths[1], cur, d + 1);
            else return findJunction(paths[0], cur, d + 1);
        }
        return [...cur, d];
    }
    const coord2id: Map<string, number> = new Map<string, number>();
    const condensedGraph: Map<number, number[][]> = new Map<number, number[][]>();
    const goalState: number[] = [0, 0];
    for(let i = 0; i < graph.length; i++) {
        for(let j = 0; j < graph[0].length; j++) {
            if(graph[i][j] === '#') continue;
            let paths: number[][] = [];
            if(i > 0 && graph[i - 1][j] !== '#') paths.push([i - 1, j]);
            if(i < graph.length - 1 && graph[i + 1][j] !== '#') paths.push([i + 1, j]);
            if(j > 0 && graph[i][j - 1] !== '#') paths.push([i, j - 1]);
            if(j < graph[0].length - 1 && graph[i][j + 1] !== '#') paths.push([i, j + 1]);
            if(paths.length !== 2) {
                const key: string = `${i},${j}`;
                if(!coord2id.has(key)) coord2id.set(key, coord2id.size);
                for(const path of paths) {
                    const end: number[] = findJunction(path, [i, j], 1);
                    const endKey: string = `${end[0]},${end[1]}`;
                    if(!coord2id.has(endKey)) coord2id.set(endKey, coord2id.size);
                    if(!condensedGraph.has(coord2id.get(key)!)) condensedGraph.set(coord2id.get(key)!, []);
                    if(!condensedGraph.has(coord2id.get(endKey)!)) condensedGraph.set(coord2id.get(endKey)!, []);
                    if(condensedGraph.get(coord2id.get(key)!)!.some((e: number[]) => e[0] === coord2id.get(endKey)!)) continue;
                    condensedGraph.get(coord2id.get(key)!)!.push([coord2id.get(endKey)!, end[2]]);
                    condensedGraph.get(coord2id.get(endKey)!)!.push([coord2id.get(key)!, end[2]]);
                }
            }
            if(i === graph.length - 1 && graph[i][j] === '.') goalState[0] = i, goalState[1] = j;
        }
    }
    const goalId: number = coord2id.get(`${goalState[0]},${goalState[1]}`)!;
    return [condensedGraph, goalId];
}

const solve = (input: string): number => {
    const expandedGraph = input.split('\n').map((line: string) => line.split(''));
    const [graph, goalId] = condenseGraph(expandedGraph);
    const stack: any[] = [];
    stack.push([0, 0, new Set()]);
    let result: number = 0;
    while(stack.length > 0) {
        const [cur, d, visited] = stack.pop()!;
        if(visited.has(cur)) continue;
        if(cur === goalId) {
            result = Math.max(result, d);
        } else {
            visited.add(cur);
            for(const [next, dist] of graph.get(cur)!) stack.push([next, d + dist, new Set(visited)]);
        }
    }
    return result;
};

console.log(solve(input));
