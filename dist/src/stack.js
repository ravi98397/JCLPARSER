"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor() {
        this.stackContainer = [];
        this.length = 0;
        this.stackContainer = [];
        this.length = 0;
    }
    push(value) {
        this.stackContainer.push(value);
        this.length++;
    }
    pop() {
        if (this.length === 0)
            return null;
        this.length--;
        let value = this.stackContainer.pop();
        return value ? value : null;
    }
    peek() {
        if (this.length === 0)
            return null;
        return this.stackContainer[this.length - 1];
    }
    isEmpty() {
        return this.length === 0;
    }
    toString() {
        let output = "";
        for (let i = 0; i < this.length; i++) {
            output += this.stackContainer[i] + " ";
        }
        return output;
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map