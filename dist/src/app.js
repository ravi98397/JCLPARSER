"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const parser_1 = require("./parser");
const stack_1 = require("./stack");
const fs = require("fs");
const jclString = `
//PRCAW999 JOB (0022),'OPERATIONS',CLASS=1,MSGCLASS=H,MSGLEVEL=1,NOTIFY=&SYSUID
//JOBLIB  DD  DSN=SYS1.SACBCNTL,DISP=SHR        HIGH LEVEL LIBRARY
//        DD  DSN=SYS1.SACBLIB,DISP=SHR
//        DD  DSN=SYS2.SACBLIB,DISP=SHR
//        SET HIGHLVL=PRCA.ILYTICS.Q           HIGH LEVEL QUALIFIER
//        SET GEN10=+1                         GENERATION NUMBER
//        SET SYSN='N'                         SYSTEM NAME
//        SET UNIT=PRODA                       UNIT
//        SET MYSPACE1=3                       SPACE
//        SET MYSPACE2=20                      SPACE 
//JS010 EXEC PGM=IEFBR14
//PRSOUT1 DD DSN=&HIGHLVL..PR1ILDAT.PRSOUT,DISP=(MOD,DELETE,DELETE),SPACE=(CYL,(1,1),RLSE)
//PRS     DD DSN=&HIGHLVL..PR1ILLOG.PRS,DISP=(MOD,DELETE,DELETE),SPACE=(CYL,(1,1),RLSE)
//PARENGEX EXEC PROC1,CYCLE=PRCA.ILYTICS.Q,
//              SPACE=(CYL,(1,1),RLSE),
//              SYSN='N',
//              UNIT=PRODA  
//JS020 EXEC PGM=SORT
//SYSOUT  DD SYSOUT=&SYSN
//SORTIN DD  DSN=PRCA.ILYTICS.Q.PR1ILDAT.PRSOUT(&GEN10),DISP=SHR 
//SORTOUT DD DSN=PRCA.ILYTICS.Q.PR1ILDAT.PRSOUT(&GEN10),DISP=(NEW,CATLG,DELETE),SPACE=(CYL,(1,1),RLSE)
//SYSPRINT DD SYSOUT=*
//SYSIN   DD *
  SORT FIELDS=COPY
/*         
`;
//WIRTING PROC1
let proc = `
//PROC1   PROC CYCLE=
//        SPACE=
//        SYSN=
//        UNIT=
//        PGM=
//PS010   EXEC PGM=IEFBR14
//IN001   DD DSN=&CYCLE..PR1ILDAT.PRSOUT,DISP=(MOD,DELETE,DELETE),SPACE=(CYL,(1,1),RLSE)
//OUT001  DD DSN=&CYCLE..PR1ILLOG.PRS,DISP=(NEW,CATLG,DELETE),SPACE=&SPACE,
//           DCB=(RECFM=FB,LRECL=80,BLKSIZE=800),UNIT=&UNIT,SPACE=(CYL,(1,1),RLSE)
//SYSOUT  DD SYSOUT=&SYSN
//SYSPRINT DD SYSOUT=*
//     
`;
// for(let line of jclString.split('\n')){
//     console.log('Parsing line:', line);
//     parser.init(line);
//     parser.parse();
//     console.log(parser.tokens);
// }
function parseJcl(jcl) {
    var _a;
    let lines = jcl.split('\n');
    let nodeStack = new stack_1.Stack();
    let parser = new parser_1.Parser();
    //parse job line
    let jobLine = lines[1];
    parser.init(jobLine);
    parser.parse();
    let jobNode = parser.node;
    nodeStack.push(jobNode);
    //start parsing remaning lines 
    for (let i = 2; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim() === '')
            continue;
        parser.init(line);
        parser.parse();
        let node = parser.node;
        console.log("current stack", nodeStack.toString());
        console.log(node.toString());
        let parent = nodeStack.peek();
        switch (node.type) {
            case 'JOB':
                nodeStack.push(node);
                break;
            case 'EXEC':
                parent = nodeStack.peek();
                while (parent && parent.type !== 'JOB') {
                    console.log('popping in exec', parent.name + ' ' + parent.type);
                    nodeStack.pop();
                    parent = nodeStack.peek();
                }
                if (parent) {
                    parent.children.push(node);
                    nodeStack.push(node);
                }
                else {
                    console.log('Error: empty stack');
                }
                break;
            case 'DD':
                if (node.name === '//' && ((_a = nodeStack.peek()) === null || _a === void 0 ? void 0 : _a.type) === 'DD') {
                    parent = nodeStack.peek();
                    if (parent) {
                        parent.children.push(node);
                    }
                    else {
                        console.log('Error: No parent for DD node');
                    }
                }
                else {
                    parent = nodeStack.peek();
                    while (parent && parent.type === 'DD') {
                        console.log('popping in dd', parent.name + ' ' + parent.type);
                        nodeStack.pop();
                        parent = nodeStack.peek();
                    }
                    if (parent) {
                        parent.children.push(node);
                        nodeStack.push(node);
                    }
                    else {
                        console.log('Error: No parent for DD node');
                    }
                }
                break;
            case 'SET':
                parent = nodeStack.peek();
                while (parent && parent.type === 'DD') {
                    console.log('popping in set', parent.name + ' ' + parent.type);
                    nodeStack.pop();
                    parent = nodeStack.peek();
                } //pop all DD nodes
                if (parent) {
                    for (let i = 0; i < node.tokens.length; i++) {
                        if (node.tokens[i] === '=') {
                            let key = node.tokens[i - 1];
                            let value = node.tokens[i + 1];
                            parent.setProperties(key, value);
                        }
                    }
                }
                else {
                    console.log('Error: No parent for SET node');
                }
                break;
            case "SYSIN":
                parent = nodeStack.peek();
                if (parent) {
                    parent.tokens = parent.tokens.concat(node.tokens);
                    parent.value = parent.value + "\n" + node.value;
                    console.log(node.tokens + ", " + node.value);
                }
                else {
                    console.log('Error: invalid statement no parent for node');
                }
                break;
            default:
                if (node.type.length == 0) {
                    parent = nodeStack.peek();
                    if (parent) {
                        parent.tokens = parent.tokens.concat(node.tokens);
                        parent.value = parent.value + node.value;
                        console.log(node.tokens + ", " + node.value);
                    }
                    else {
                        console.log('Error: invalid statement no parent for node');
                    }
                }
        }
    }
    return jobNode;
}
//function to expand all the procs in jcl
function procExpansion(inputjcl) {
    let lines = inputjcl.split('\n');
    let expandedJcl = lines;
    let outputJcl = "";
    let procregex = /\/\/[A-Z0-9#@$]+[ ]+EXEC[ ]+[A-Z0-9#@$]+,/g;
    for (let line of lines) {
        let match = line.match(procregex);
        if (match) {
            console.log("Matched proc", match[0]);
            // let procName = match[0].split(' ')[0];
            // let proc = procMap[procName];
            // let procLines = proc.split('\n');
            // expandedJcl = expandedJcl.concat(procLines);
        }
    }
    return outputJcl;
}
function structureJCL(input) {
    var _a, _b, _c, _d, _e;
    input = removeCommentsandEmptyLines(input);
    console.log(input);
    let regex = /\/\/[A-Z0-9$@#]+[ ]+[A-Z]+[ ]+/g;
    let lines = input.split(regex);
    lines.splice(0, 1);
    let matches = input.match(regex);
    //console.log(lines);
    let matchesArray = [];
    matches === null || matches === void 0 ? void 0 : matches.forEach((match) => {
        if (match != "\n") {
            matchesArray.push(match);
        }
    });
    let stack = new stack_1.Stack();
    let match = matchesArray[0].trim().split(' ');
    let root = new node_1.Node(match[0], match[match.length - 1], lines[0]);
    stack.push(root);
    for (let i = 1; i < matchesArray.length; i++) {
        console.log(matchesArray[i], lines[i]);
        let match = matchesArray[i].trim().split(' ');
        let node = new node_1.Node(match[0], match[match.length - 1], lines[i]);
        if (!stack.isEmpty()) {
            if (((_a = stack.peek()) === null || _a === void 0 ? void 0 : _a.type) === 'DD') {
                (_b = stack.peek()) === null || _b === void 0 ? void 0 : _b.children.push(node);
            }
            else {
                if (node.type === 'EXEC') {
                    while (((_c = stack.peek()) === null || _c === void 0 ? void 0 : _c.type) === 'EXEC') {
                        stack.pop();
                    }
                    (_d = stack.peek()) === null || _d === void 0 ? void 0 : _d.children.push(node);
                    stack.push(node);
                }
                else {
                    (_e = stack.peek()) === null || _e === void 0 ? void 0 : _e.children.push(node);
                }
            }
        }
        else {
            console.log("Empty stack");
        }
    }
    return root;
}
function removeCommentsandEmptyLines(input) {
    let lines = input.split('\n');
    let output = "";
    for (let line of lines) {
        if (line.trim() === '' || line.trim().startsWith('//*'))
            continue;
        output += line + '\n';
    }
    return output;
}
// let node :Node = parseJcl(jclString);
// fs.writeFileSync('jcl.json', JSON.stringify(node, null, 2));
//procExpansion(jclString);
fs.writeFileSync('jcl.json', JSON.stringify(structureJCL(jclString), null, 2));
//# sourceMappingURL=app.js.map