export declare class Structrue {
    parsedValues: {
        [key: string]: any;
    };
    tokens: string[];
    current_index: number;
    length: number;
    constructor();
    init(input: string[]): void;
    parse(): void;
    isAtEnd(): boolean;
    advance(): string;
    peek(): string;
}
