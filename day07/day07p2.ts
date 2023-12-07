// --- Part Two ---
// To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

// To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

// J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

// Now, the above example goes very differently:

// 32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483
// 32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
// KK677 is now the only two pair, making it the second-weakest hand.
// T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.
// With the new joker rule, the total winnings in this example are 5905.

// Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?

import * as fs from 'fs';

const input: string = fs.readFileSync('day07/day07_input.txt', 'utf8');

const getCardStrength = (card: string): number => {
    if(card === 'A') return 14;
    if(card === 'K') return 13;
    if(card === 'Q') return 12;
    if(card === 'J') return 1;
    if(card === 'T') return 10;
    return parseInt(card);
}

const getHandStrength = (hand: string): string => {
    const cardFrequencies: Map<string, number> = new Map<string, number>();
    hand.split('').forEach((card: string) => cardFrequencies.set(card, (cardFrequencies.get(card) || 0) + 1));
    const jokers: number = cardFrequencies.get('J') || 0;
    cardFrequencies.delete('J');
    const descendingFrequencies: number[] = [...cardFrequencies.values()].sort((a, b) => b - a);
    return String(((descendingFrequencies[0] || 0) + jokers) * 3 + (descendingFrequencies[1] || 0))
}

const handComparator = (handOneInfo: string[], handTwoInfo: string[]): number => {
    if(handOneInfo[0] !== handTwoInfo[0]) return Number(handOneInfo[0]) < Number(handTwoInfo[0]) ? 1 : -1;
    for(const [idx, _] of handOneInfo[1].split('').entries())
        if(handOneInfo[1][idx] !== handTwoInfo[1][idx]) return getCardStrength(handOneInfo[1][idx]) < getCardStrength(handTwoInfo[1][idx]) ? 1 : -1;
    return 0;
}

const solve = (input: string): number => {
    const hands: string[][] = input.split('\n').map((line: string) => line.split(' '));
    const rankedHands: string[][] = [];
    hands.forEach((hand: string[]) => rankedHands.push([getHandStrength(hand[0]), hand[0], hand[1]]));
    return rankedHands.sort(handComparator).reduce((acc: number, val: string[], idx: number) => acc + (rankedHands.length - idx) * Number(val[2]), 0);
};

console.log(solve(input));
