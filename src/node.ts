export class Node{
    name : string = "";
    type : string = "";
    args : string[] = [];
    libs : string[] = [];
    proerties : { [key: string]: any; } = {};
    children : Node[] = [];

    tosring(){
        return `Name: ${this.name}, Type: ${this.type}, Args: ${this.args}, Libs: ${this.libs}, Properties: ${this.proerties}, Children: ${this.children}`;
    }
}