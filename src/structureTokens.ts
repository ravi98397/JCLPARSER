export class Structrue{

    parsedValues: { [key: string]: any; } = {};
    
    tokens :string[] = [];
    
    current_index: number = 0;
    length: number = 0;
    

    constructor(){}

    init(input: string[]){
        this.tokens = input;
        this.length = input.length;
        
        if(this.tokens[this.current_index].startsWith('//')){
            this.current_index += 2;
            this.parsedValues['name'] = this.tokens[0];
            this.parsedValues['type'] = this.tokens[1];
        }
    }

    parse(){
        while(!this.isAtEnd()){
            let c = this.advance();
            console.log('Token:', c);
        }
    }

    isAtEnd(){
        return this.current_index >= this.tokens.length;
    }

    advance(){
        this.current_index++;
        return this.tokens[this.current_index - 1];
    }   

    peek(){
        if (this.isAtEnd()) return '\0';
        return this.tokens[this.current_index];
    }
}