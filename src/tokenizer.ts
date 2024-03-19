export class Tokenizer{
    input: string = "";
    start: number = 0;
    current_index: number = 0;
    length: number = 0;
    tokens :string[] = [];
    constructor() {}
    init(input: string){
        this.tokens = [];
        
        this.length = this.input.length;
        this.current_index = 0;
        this.start = 0;
    }
}