export declare class Tokenizer {
    input: string;
    start: number;
    current_index: number;
    length: number;
    tokens: string[];
    constructor();
    init(input: string): void;
}
