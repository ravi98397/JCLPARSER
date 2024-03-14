"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Parser = /** @class */ (function () {
    function Parser() {
        this.input = "";
        this.start = 0;
        this.current_index = 0;
        this.length = 0;
        this.tokens = [];
    }
    Parser.prototype.init = function (input) {
        this.input = input;
        this.length = input.length;
        this.current_index = 0;
        this.start = 0;
        this.tokens = [];
    };
    Parser.prototype.advance = function () {
        this.current_index++;
        return this.input[this.current_index - 1];
    };
    Parser.prototype.peek = function () {
        if (this.isAtEnd())
            return '\0';
        return this.input[this.current_index];
    };
    Parser.prototype.match = function (char) {
        if (this.input[this.current_index] === char) {
            this.current_index++;
            return true;
        }
        return false;
    };
    Parser.prototype.parse = function () {
        while (!this.isAtEnd()) {
            var c = this.advance();
            switch (c) {
                case "'":
                    while (this.peek() !== "'") {
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case '"':
                    while (this.peek() !== '"') {
                        this.advance();
                    }
                    this.advance();
                    this.tokens.push(this.input.substring(this.start, this.current_index));
                    this.start = this.current_index;
                    break;
                case "(":
                    while (this.peek() !== ")") {
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
                    if (this.peek() === " " || this.peek() === "," || this.peek() === "=") {
                        this.tokens.push(this.input.substring(this.start, this.current_index));
                        this.start = this.current_index;
                    }
                    break;
            }
        }
        this.tokens.push(this.input.substring(this.start, this.current_index));
        this.removeSpacesandEmptyTokens();
        console.log(this.tokens);
    };
    Parser.prototype.isAtEnd = function () {
        return this.current_index >= this.length;
    };
    Parser.prototype.removeSpacesandEmptyTokens = function () {
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] === " " || this.tokens[i] === "") {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    };
    Parser.prototype.cleanTokes = function () {
        //remove tokens then there are more than one space in a row
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] === " " && this.tokens[i + 1] === " ") {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    };
    Parser.prototype.getTokens = function () {
        return this.tokens;
    };
    return Parser;
}());
exports.Parser = Parser;
