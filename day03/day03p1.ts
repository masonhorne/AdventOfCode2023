// --- Day 3: Gear Ratios ---
// You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

// It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

// "Aaah!"

// You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

// The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

// The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

// Here is an example engine schematic:

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
// In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

// Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

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

const solve = (input: string): number => {
    const graph: string[][] = input.split('\n').map((line: string) => line.split(''));
    let result: number = 0;
    for(let row: number = 0; row < graph.length; row++) {
        for(let col: number = 0; col < graph[row].length; col++) {
            if(graph[row][col] >= '0' && graph[row][col] <= '9') {
                if(isPartNumber(graph, row, col)) {
                    let partNumberLength: number = 0;
                    while (partNumberLength < graph[row].length && isDigit(graph[row][col + partNumberLength])) partNumberLength++;
                    result += parseInt(graph[row].slice(col, col + partNumberLength).join(''));
                    col += partNumberLength;
                }
            }
        }
    }
    return result;
}

console.log(solve(input));
