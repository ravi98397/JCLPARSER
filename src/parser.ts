export class Parser {
    
    input: string = "";
    start: number = 0;
    current_index: number = 0;
    length: number = 0;
    
    tokens :string[] = [];

    constructor() {}

    init(input: string){
        this.input = input;
        this.length = input.length;
        this.current_index = 0;
        this.start = 0;

        this.tokens = [];
    }

    advance(){
        this.current_index++;
        return this.input[this.current_index - 1];
    }

    peek(){
        if (this.isAtEnd()) return '\0';
        return this.input[this.current_index];
    }

    match(char: string){
        if (this.input[this.current_index] === char) {
            this.current_index++;
            return true;
        }
        return false;
    }
    
    public parse(){
        while(!this.isAtEnd()){
            let c = this.advance();
            switch(c){ 
                case "'":
                    while(this.peek() !== "'"){
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case '"':
                    while(this.peek() !== '"'){
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case "(":
                    while(this.peek() !== ")"){
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case ",":
                case "=":
                case " ":
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                default:
                    if(this.peek() === " " || this.peek() === "," || this.peek() === "="){
                        this.tokens.push(this.input.substring(this.start, this.current_index));
                        this.start = this.current_index;
                    }
                    break;
            }
        }
        this.tokens.push(this.input.substring(this.start, this.current_index));

        this.removeSpacesandEmptyTokens();
        console.log(this.tokens);
    }

    isAtEnd(){
        return this.current_index >= this.length;
    }

    removeSpacesandEmptyTokens(){
        for (let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] === " " || this.tokens[i] === "") {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    }
    
    cleanTokes(){
        //remove tokens then there are more than one space in a row
        for (let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] === " " && this.tokens[i + 1] === " ") {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    }
    
    getTokens(){
        return this.tokens;
    }
}
