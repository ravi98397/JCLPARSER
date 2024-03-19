export declare class Stack<T> {
    stackContainer: T[];
    length: number;
    constructor();
    push(value: T): void;
    pop(): T | null;
    peek(): T | null;
    isEmpty(): boolean;
    toString(): string;
}
