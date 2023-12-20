// --- Part Two ---
// Even with your help, the sorting process still isn't fast enough.

// One of the Elves comes up with a new plan: rather than sort parts individually through all of these workflows, maybe you can figure out in advance which combinations of ratings will be accepted or rejected.

// Each of the four ratings (x, m, a, s) can have an integer value ranging from a minimum of 1 to a maximum of 4000. Of all possible distinct combinations of ratings, your job is to figure out which ones will be accepted.

// In the above example, there are 167409079868000 distinct combinations of ratings that will be accepted.

// Consider only your list of workflows; the list of part ratings that the Elves wanted you to sort is no longer relevant. How many distinct combinations of ratings will be accepted by the Elves' workflows?

import * as fs from 'fs';

const input: string = fs.readFileSync('day19/day19_input.txt', 'utf8');

const solve = (input: string): number => {
    const sections = input.split('\n\n');
    const ruleMap = new Map<string, string[][]>();
    sections[0].split('\n').forEach((line: string) => {
        const [workflow, ruleText] = line.split('{');
        const rules: string[] = ruleText.slice(0, -1).split(',');
        if(!ruleMap.has(workflow)) ruleMap.set(workflow, []);
        const results: string[][] = [];
        for(const rule of rules) {
            const idx: number = rule.indexOf(':');
            if(idx === -1) {
                const nextWorkflow: string = rule;
                ruleMap.set(workflow, [...ruleMap.get(workflow)!, [nextWorkflow]]);
            } else {
                const nextWorkflow: string = rule.slice(idx + 1).trim();
                const condition: string = rule.slice(0, idx).trim();
                let operatorIndex: number = condition.indexOf('<');
                if(operatorIndex === -1) operatorIndex = condition.indexOf('>');
                const variable: string = condition.slice(0, operatorIndex);
                const operator: string = condition[operatorIndex];
                const value: string = condition.slice(operatorIndex + 1);
                ruleMap.set(workflow, [...ruleMap.get(workflow)!, [variable, operator, value, nextWorkflow]]);
            }
        }
        return results;
    });
    const stack: any[][] = [];
    const MIN_RATING: number = 1, MAX_RATING: number = 4000;
    stack.push(['in', new Map<string, number[]>(
        [
            ['x', [MIN_RATING, MAX_RATING]], 
            ['m', [MIN_RATING, MAX_RATING]], 
            ['a', [MIN_RATING, MAX_RATING]], 
            ['s', [MIN_RATING, MAX_RATING]],
        ])]);
    let result: number = 0;
    while(stack.length > 0) {
        const [workflow, categoryRanges] = stack.pop()!
        if(workflow === 'A' || workflow === 'R') {
            if(workflow === 'A') {
                result += [...categoryRanges.values()]
                .reduce((acc: number, [low, high]: number[]) => acc * (high - low + 1), 1);
            }
            continue;
        }
        const rules: string[][] = ruleMap.get(workflow)!;
        for(let ruleIndex: number = 0; ruleIndex < rules.length; ruleIndex++) {
            if(rules[ruleIndex].length === 1) {
                stack.push([rules[ruleIndex][0], new Map(categoryRanges)])
            } else {
                const variable: string = rules[ruleIndex][0];
                const operator: string = rules[ruleIndex][1];
                const value: number = Number(rules[ruleIndex][2]);
                const nextWorkflow: string = rules[ruleIndex][3];
                const currentVariableRange: number[] = categoryRanges.get(variable)!;
                if(operator === '<' && currentVariableRange[0] <= value && value <= currentVariableRange[1]) {
                    categoryRanges.set(variable, [currentVariableRange[0], value - 1]);
                    stack.push([nextWorkflow, new Map(categoryRanges)]);
                    categoryRanges.set(variable, [value, currentVariableRange[1]]);
                }
                if(operator === '>' && currentVariableRange[0] <= value && value <= currentVariableRange[1]) {
                    categoryRanges.set(variable, [value + 1, currentVariableRange[1]]);
                    stack.push([nextWorkflow, new Map(categoryRanges)]);
                    categoryRanges.set(variable, [currentVariableRange[0], value]);
                }
            }
        }
    }
    return result;
};

console.log(solve(input));
