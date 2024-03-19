"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
class Tokenizer {
    constructor() {
        this.input = "";
        this.start = 0;
        this.current_index = 0;
        this.length = 0;
        this.tokens = [];
    }
    init(input) {
        this.tokens = [];
        this.length = this.input.length;
        this.current_index = 0;
        this.start = 0;
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map