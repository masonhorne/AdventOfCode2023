export interface PriorityQueue<T> {
    size(): number;
    isEmpty(): boolean;
    peek(): T | undefined;
    push(value: T): number;
    pop(): T | undefined;
}

export class PriorityQueue<T> implements PriorityQueue<T>  {
    private data: T[];
    private comparator: (a: T, b: T) => number;
    private top: number = 0;

    constructor(comparator: (a: T, b: T) => number = (a, b) => a < b ? -1 : 1) {
        this.data = [];
        this.comparator = comparator;
    }

    private parent(index: number) {
        return ((index + 1) >> 1) - 1
    }

    private left(index: number) {
        return (index << 1) + 1
    }

    private right(index: number) {
        return (index + 1) << 1
    }


    private compare(a: number, b: number): number {
        return this.comparator(this.data[a], this.data[b]);
    }

    private swap(i: number, j: number) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    private siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this.compare(node, this.parent(node)) < 0) {
            this.swap(node, this.parent(node));
            node = this.parent(node);
        }
    }

    private siftDown() {
        let node = this.top;
        while (
            (this.left(node) < this.size() && this.compare(this.left(node), node) < 0) ||
            (this.right(node) < this.size() && this.compare(this.right(node), node) < 0)
        ) {
            const maxChild = (this.right(node) < this.size() && this.compare(this.right(node), this.left(node)) < 0) ? this.right(node) : this.left(node);
            this.swap(node, maxChild);
            node = maxChild;
        }
    }

    public size(): number {
        return this.data.length;
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public peek(): T | undefined {
        return this.data[this.top];
    }

    public push(value: T) {
        this.data.push(value);
        this.siftUp();
        return this.size();
    }

    public pop(): T | undefined {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top) {
            this.swap(this.top, bottom);
        }
        this.data.pop();
        this.siftDown();
        return poppedValue;
    }
  }