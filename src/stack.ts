export class Stack<T>{

    stackContainer: T[] = [];
    length: number = 0;

    constructor(){
        this.stackContainer = [];
        this.length = 0;
    }

    push(value: T){
        this.stackContainer.push(value);
        this.length++;
    }

    pop() : T | null{
        if(this.length === 0) return null;
        this.length--;
        let value = this.stackContainer.pop();
        return value ? value : null;
    }

    peek() : T | null{
        if(this.length === 0) return null;
        return this.stackContainer[this.length - 1];
    }

    isEmpty(){
        return this.length === 0;
    }

    toString() : string{
        let output = "";
        for(let i = 0; i < this.length; i++){
            output += this.stackContainer[i] + " ";
        }
        return output;
    }
}