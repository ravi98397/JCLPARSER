export declare class Node {
    name: string;
    type: string;
    tokens: string[];
    value: string;
    args: string[];
    libs: string[];
    properties: {
        [key: string]: any;
    };
    children: Node[];
    constructor(name?: string, type?: string, value?: string);
    toString(): string;
    getvalue(): string;
    setArgs(): void;
    setProperties(key: string, value: any): void;
    getTokens(): void;
}
