import { Node } from "./node";
import { Stack } from "./stack";

export class Parser {
    
    input: string = "";
    start: number = 0;
    current_index: number = 0;
    length: number = 0;
    
    tokens :string[] = [];

    node: Node = new Node();

    constructor() {}

    init(input: string){
        this.tokens = [];
        this.node = new Node();
        this.input = this.splitNameTypeValue(input);
        this.length = this.input.length;
        this.current_index = 0;
        this.start = 0;
    }

    splitNameTypeValue(input :string) :string{ //whole line

        let name = "";
        let rest = "";

        //remove //setname from the line
        if(input.includes("//")){
            name = input.substring(0, input.indexOf(" "));
            rest = input.substring(input.indexOf(" ")).trim();
        }else{
            //this is special else to handle sysin where input/options are given in jcl
            this.node.name = "";
            this.node.type = "SYSIN";

            rest = input.trim();
            return rest;
        }
        
        this.node.name = name;

        if(rest.startsWith("JOB")){
            let job = input.split("JOB");
            this.node.type = "JOB";
            return job[1].trim();
        }

        if(rest.startsWith("EXEC")){ //rest = "EXEC PGM=IEFBR14"
            let exec = input.split("EXEC");
            this.node.type = "EXEC";
            return exec[1].trim();
        }

        if(rest.startsWith("DD")){ //rest = "DD DSN=SYS1.MACLIB,DISP=SHR"
            let dd = input.split("DD");
            this.node.type = "DD";
            return dd[1].trim();
        }

        if(rest.startsWith("SET")){
            let set = input.split("SET");
            this.node.type = "SET";
            return set[1].trim();
        }

        return input.substring(2).trim();
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
                    let bracket :Stack<string> = new Stack<string>();
                    bracket.push("(");
                    while(!bracket.isEmpty()){
                        if(this.peek() === "("){
                            bracket.push("(");
                        }
                        if(this.peek() === ")"){
                            bracket.pop();
                        }
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case ",":
                case "=":
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case " ":
                    this.current_index = this.length;
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
        this.cleanTokes();
        if(this.node.type === "SYSIN"){
            this.node.value = this.input;
            this.tokens = [];
        }else{
            this.node.tokens = this.tokens;
            this.node.value = this.tokens.join("");
        }
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

            if (this.tokens[i] === "") {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    }
    
    getTokens(){
        return this.tokens;
    }
}
