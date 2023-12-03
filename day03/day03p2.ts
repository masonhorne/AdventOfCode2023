// --- Part Two ---
// The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

// You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

// Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

// The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

// This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

// Consider the same engine schematic again:

// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

// What is the sum of all of the gear ratios in your engine schematic?

import * as fs from 'fs';

const input: string = fs.readFileSync('day03/day03_input.txt', 'utf8');

const isDigit = (char: string): boolean => {
    return char >= '0' && char <= '9';
}

const isValidSpace = (graph: string[][], i: number, j: number): boolean => {
    return i >= 0 && i < graph.length && j >= 0 && j < graph[i].length;
}

const isPartNumber = (graph: string[][], i: number, j: number): boolean =>  {
    if(!isValidSpace(graph, i, j) || graph[i][j] === '.') return false;
    if(graph[i][j].match(/\W/)) return true;
    const value: string = graph[i][j];
    graph[i][j] = '.';
    for(let rowOffset: number = -1; rowOffset <= 1; rowOffset++) {
        for(let colOffset: number = -1; colOffset <= 1; colOffset++) {
            if(rowOffset === 0 && colOffset === 0) continue;
            if(isValidSpace(graph, i + rowOffset, j + colOffset) && graph[i + rowOffset][j + colOffset] !== '.' && isPartNumber(graph, i + rowOffset, j + colOffset)) {
                graph[i][j] = value;
                return true;
            }
        }
    }
    graph[i][j] = value;
    return false;
}

const connectedPartNumbers = (graph: string[][], i: number, j: number): number[] => {
    const partNumbers: number[] = []
    for(let rowOffset: number = -1; rowOffset <= 1; rowOffset++) {
        for(let colOffset: number = -1; colOffset <= 1; colOffset++) {
            if(rowOffset === 0 && colOffset === 0) continue;
            const [x, y] = [i + rowOffset, j + colOffset];
            if(isValidSpace(graph, i + rowOffset, j + colOffset) && graph[i + rowOffset][j + colOffset] !== '.' && isPartNumber(graph, i + rowOffset, j + colOffset)) {
                let leftOffset: number = 0, rightOffset: number = 0;
                while(y - leftOffset >= 0 && isDigit(graph[x][y - leftOffset])) leftOffset++;
                while(y + rightOffset < graph[x].length && isDigit(graph[x][y + rightOffset])) rightOffset++;
                partNumbers.push(parseInt(graph[x].slice(y - leftOffset + 1, y + rightOffset).join('')));
                colOffset += isDigit(graph[x][y + 1]) ? (isDigit(graph[x][y + 2]) ? 2 : 1) : 0;
            }
        }
    }
    return partNumbers;
}

const solve = (input: string): number => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    let result: number = 0;
    for(let row: number = 0; row < graph.length; row++) {
        for(let col: number = 0; col < graph[row].length; col++) {
            if(graph[row][col] === '*') {
                const connectedParts = connectedPartNumbers(graph, row, col);
                if(connectedParts.length === 2) result += connectedParts[0] * connectedParts[1];
            }
        }
    }
    return result;
}

console.log(solve(input));
