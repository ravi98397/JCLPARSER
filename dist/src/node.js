"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor(name, type, value) {
        this.name = "";
        this.type = "";
        this.tokens = [];
        this.value = "";
        this.args = [];
        this.libs = [];
        this.properties = {};
        this.children = [];
        this.name = name ? name : "";
        this.type = type ? type : "";
        this.value = value ? value : "";
    }
    toString() {
        //return `Name: ${this.name}, Type: ${this.type}, Value: ${this.value}, Tokens: ${this.tokens}`; 
        return this.type;
    }
    getvalue() {
        return this.value;
    }
    setArgs() {
        this.args = this.tokens;
    }
    setProperties(key, value) {
        this.properties[key] = value;
    }
    getTokens() {
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map