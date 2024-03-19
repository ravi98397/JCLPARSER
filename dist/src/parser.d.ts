import { Node } from "./node";
export declare class Parser {
    input: string;
    start: number;
    current_index: number;
    length: number;
    tokens: string[];
    node: Node;
    constructor();
    init(input: string): void;
    splitNameTypeValue(input: string): string;
    advance(): string;
    peek(): string;
    match(char: string): boolean;
    parse(): void;
    isAtEnd(): boolean;
    removeSpacesandEmptyTokens(): void;
    cleanTokes(): void;
    getTokens(): string[];
}
