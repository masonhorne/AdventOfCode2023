// --- Part Two ---
// The final machine responsible for moving the sand down to Island Island has a module attached named rx. The machine turns on when a single low pulse is sent to rx.

// Reset all modules to their default states. Waiting for all pulses to be fully handled after each button press, what is the fewest number of button presses required to deliver a single low pulse to the module named rx?

import * as fs from 'fs';

const input: string = fs.readFileSync('day20/day20_input.txt', 'utf8');

const getParents = (graph: Map<string, any[]>, node: string): string[] => {
    const parents: string[] = [];
    for(const nodeEntry of graph.entries()) {
        const [nodeName, [_, nodeChildren, __]] = nodeEntry;
        if(nodeChildren.includes(node)) parents.push(nodeName);
    }
    return parents;
}

const parseGraph = (input: string): Map<string, any[]> => {
    const graph: Map<string, any[]> = new Map<string, any[]>();
    const conjunctionNodes: string[] = [];
    input.split('\n').map((line: string) => line.split(' -> ')).forEach((edge: string[]) => {
        const [from, to] = edge;
        if(from.startsWith('broadcaster'))  {
            graph.set(from, ['broadcaster', to.split(', ')]);
        } else {
            const nodeType = from[0];
            const nodeName = from.slice(1);
            if(nodeType === '&') {
                conjunctionNodes.push(nodeName);
            }
            graph.set(nodeName, [nodeType, to.split(', '), (nodeType === '%' ? false : new Map<string, boolean>())]);
        }
    });
    for(const conjunctionNode of conjunctionNodes) {
        const parents = getParents(graph, conjunctionNode);
        const [_, __, receivedStatuses] = graph.get(conjunctionNode)!;
        for(const parent of parents) receivedStatuses.set(parent, false);
    }
    return graph;
}

const gcd = (a: number, b: number): number => {
    if(b == 0) return a;
    return gcd(b, a % b);
}

const lcm = (...nums: number[]) => {
    let result: number = nums[0];
    for(let i = 1; i < nums.length; i++) result = (result * nums[i]) / gcd(result, nums[i]);
    return result;
}

const solve = (input: string): number => {
    const graph: Map<string, any[]> = parseGraph(input);
    let rxAncestors: string[] = getParents(graph, 'rx').map((parent: string) => getParents(graph, parent)).flat();
    const rxAncestorsLowPulseOccurrences: Map<string, number> = new Map<string, number>();
    const ancestorLowPulseCycleLengths: number[] = [];
    const currentPulses: any[][] = [];
    let presses: number = 0;
    while(true) {
        presses++;
        currentPulses.push(['broadcaster', false, 'button']);
        while(currentPulses.length > 0) {
            const [node, isHighPulse, parentNode] = currentPulses.shift()!;
            if(!isHighPulse && rxAncestors.includes(node)) {
                if(!rxAncestorsLowPulseOccurrences.has(node)) rxAncestorsLowPulseOccurrences.set(node, presses);
                else {
                    rxAncestors = rxAncestors.filter((ancestor: string) => ancestor !== node);
                    ancestorLowPulseCycleLengths.push(presses - rxAncestorsLowPulseOccurrences.get(node)!);
                }
                if(rxAncestors.length === 0) return lcm(...ancestorLowPulseCycleLengths);
            }
            if(graph.has(node)) {
                const [nodeType, childNodes, status] = graph.get(node)!;
                if(nodeType === 'broadcaster') {
                    for(const child of childNodes) {
                        currentPulses.push([child, isHighPulse, node]);
                    }
                }
                if(nodeType === '&') {
                    status.set(parentNode, isHighPulse);
                    if([...status.values()].every((pulseRemembered: boolean) => pulseRemembered === true)) {
                        for(const child of childNodes) {
                            currentPulses.push([child, false, node]);
                        }
                    } else {
                        for(const child of childNodes) {
                            currentPulses.push([child, true, node]);
                        }
                    }
                }
                if(nodeType === '%') {
                    if(!isHighPulse) {
                        for(const child of childNodes) {
                            currentPulses.push([child, !status, node]);
                        }
                        graph.set(node, [nodeType, childNodes, !status]);
                    }
                }
            }
        }
    }
};

console.log(solve(input));
