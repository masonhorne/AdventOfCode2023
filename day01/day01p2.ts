// --- Part Two ---
// Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

// Equipped with this new information, you now need to find the real first and last digit on each line. For example:

// two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen
// In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

// What is the sum of all of the calibration values?

import * as fs from 'fs';

const input: string = fs.readFileSync('day01/day01_input.txt', 'utf8');
const DIGIT_STRINGS: string[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const getDigit = (word: string, index: number): number => {
    for(const [i, digitString] of DIGIT_STRINGS.entries()) {
        if(word.slice(index).startsWith(digitString)) return i + 1;
    }
    return parseInt(word[index]) || 0;
}

const getCalibrationValue = (word: string): number => {
    let firstDigit: number = 0, lastDigit: number = 0;
    word.split('').forEach((_, i) => {
        const digit: number = getDigit(word, i);
        if(digit === 0) return;
        lastDigit = digit ?? lastDigit;
        if(firstDigit !== 0) return;
        firstDigit = digit ?? firstDigit;
    });
    return firstDigit * 10 + lastDigit;
}

const solve = (input: string) => {
    return input.split('\n').reduce((acc, value) => acc + getCalibrationValue(value), 0);
}

console.log(solve(input));
