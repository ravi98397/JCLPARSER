export class Node{
    public name : string = "";
    public type : string = "";
    public tokens : string[] = [];
    public value : string = "";
    public args : string[] = [];
    public libs : string[] = [];
    public properties : { [key: string]: any; } = {};
    public children : Node[] = [];


    constructor(name?: string, type?: string, value?: string){
        this.name = name ? name : "";
        this.type = type ? type : "";
        this.value = value ? value : "";
    }

    toString() : string{
        //return `Name: ${this.name}, Type: ${this.type}, Value: ${this.value}, Tokens: ${this.tokens}`; 
        return this.type;
    }

    getvalue(){
        return this.value;
    }

    setArgs(){
        this.args = this.tokens;
    }

    setProperties(key: string, value: any){
        this.properties[key] = value;
    }

    getTokens(){

    }


}