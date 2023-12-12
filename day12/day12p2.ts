// --- Part Two ---
// As you look out at the field of springs, you feel like there are way more springs than the condition records list. When you examine the records, you discover that they were actually folded up this whole time!

// To unfold the records, on each row, replace the list of spring conditions with five copies of itself (separated by ?) and replace the list of contiguous groups of damaged springs with five copies of itself (separated by ,).

// So, this row:

// .# 1
// Would become:

// .#?.#?.#?.#?.# 1,1,1,1,1
// The first line of the above example would become:

// ???.###????.###????.###????.###????.### 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
// In the above example, after unfolding, the number of possible arrangements for some rows is now much larger:

// ???.### 1,1,3 - 1 arrangement
// .??..??...?##. 1,1,3 - 16384 arrangements
// ?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement
// ????.#...#... 4,1,1 - 16 arrangements
// ????.######..#####. 1,6,5 - 2500 arrangements
// ?###???????? 3,2,1 - 506250 arrangements
// After unfolding, adding all of the possible arrangement counts together produces 525152.

// Unfold your condition records; what is the new sum of possible arrangement counts?

import * as fs from 'fs';

const input: string = fs.readFileSync('day12/day12_input.txt', 'utf8');

const possibleSpring = (character: string) => character === '?' || character === '#';
const validSectionPlacement = (row: string, rowIndex: number, sectionLength: number): boolean => rowIndex + sectionLength == row.length || row[rowIndex + sectionLength] !== '#';
const validSpringConfiguration = (row: string, rowIndex: number): boolean => rowIndex >= row.length || row.slice(rowIndex).split('').every((character: string) => character === '.' || character === '?');

const getPossibilities = (row: string, sections: number[], rowIndex: number, sectionIndex: number, memo: Map<string, number>): number => {
    if(memo.has(`${rowIndex},${sectionIndex}`)) return memo.get(`${rowIndex},${sectionIndex}`)!;
    while(rowIndex < row.length && row[rowIndex] === '.') rowIndex++;
    if(sectionIndex == sections.length) return validSpringConfiguration(row, rowIndex) ? 1 : 0;
    if(rowIndex >= row.length) return 0;
    let result: number = 0;
    if(possibleSpring(row[rowIndex])) {
        const sectionLength: number = sections[sectionIndex];
        if(rowIndex + sectionLength <= row.length) {
            const possibleSprings: string[] = row.slice(rowIndex, rowIndex + sectionLength).split('');
            if(validSectionPlacement(row, rowIndex, sectionLength) && possibleSprings.every(possibleSpring)) 
                result += getPossibilities(row, sections, rowIndex + sectionLength + 1, sectionIndex + 1, memo);
        }
    }
    if(row[rowIndex] !== '#') result += getPossibilities(row, sections, rowIndex + 1, sectionIndex, memo);
    memo.set(`${rowIndex},${sectionIndex}`, result);
    return result;
}

const solve = (input: string): number => {
    return input.split('\n')
        .map((line: string) => line.split(' '))
        .map((line: string[]) => {
            let newSpringLayout: string = '', newSectionLayout: string = '';
            Array(5).fill(0).forEach(() => {
                newSpringLayout += line[0] + '?';
                newSectionLayout += line[1] + ',';
            });
            return [newSpringLayout.slice(0, -1), newSectionLayout.slice(0, -1)];
        }).map((line: string[]) => getPossibilities(line[0], line[1].split(',').map(Number), 0, 0, new Map<string, number>()))
        .reduce((acc: number, val: number) => acc + val, 0);
}

console.log(solve(input));
