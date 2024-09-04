import { Node } from "./node";
import { Parser } from "./parser";
import { Stack } from "./stack";

import * as fs from 'fs';

const jclString = 
`
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
//         
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


function parseJcl(jcl :string) :Node{
    let lines = jcl.split('\n');

    let nodeStack :Stack<Node> = new Stack<Node>();
    let parser :Parser = new Parser();
    
    
    //parse job line
    let jobLine = lines[1];
    parser.init(jobLine);
    parser.parse();
    let jobNode :Node = parser.node;

    nodeStack.push(jobNode);

    //start parsing remaning lines 
    for(let i = 2; i < lines.length; i++){
        let line = lines[i];

        if(line.trim() === '') continue;

        parser.init(line);
        parser.parse();
        let node :Node = parser.node;
        console.log("current stack", nodeStack.toString())
        console.log(node.toString());

        let parent = nodeStack.peek();
        switch(node.type){
            case 'JOB':
                nodeStack.push(node);
                break;
            case 'EXEC':
                parent = nodeStack.peek();
                while(parent && parent.type !== 'JOB'){
                    console.log('popping in exec', parent.name + ' ' + parent.type);
                    nodeStack.pop();
                    parent = nodeStack.peek();
                }

                if(parent){
                    parent.children.push(node);
                    nodeStack.push(node);
                }else{
                    console.log('Error: empty stack');
                }
                break;
            case 'DD':
                if(node.name === '//' && nodeStack.peek()?.type === 'DD'){
                    parent = nodeStack.peek();
                    if(parent){
                        parent.children.push(node);
                    }else{
                        console.log('Error: No parent for DD node');
                    }
                }else{
                    parent = nodeStack.peek();
                    while(parent && parent.type === 'DD'){
                        console.log('popping in dd', parent.name + ' ' + parent.type);
                        nodeStack.pop();
                        parent = nodeStack.peek();
                    }

                    if(parent){
                        parent.children.push(node);
                        nodeStack.push(node);
                    }else{
                        console.log('Error: No parent for DD node');
                    }
                }
                break;
            case 'SET':
                parent = nodeStack.peek();
                while(parent && parent.type === 'DD' ){
                    console.log('popping in set', parent.name + ' ' + parent.type);
                    nodeStack.pop();
                    parent = nodeStack.peek();
                }  //pop all DD nodes

                if(parent){
                    for(let i = 0; i < node.tokens.length; i++){
                        if(node.tokens[i] === '='){
                            let key = node.tokens[i-1];
                            let value = node.tokens[i+1];
                            parent.setProperties(key, value);
                        }
                    }
                }else{
                    console.log('Error: No parent for SET node');
                }
                break;
            case "SYSIN":
                parent = nodeStack.peek();
                if(parent){
                    parent.tokens = parent.tokens.concat(node.tokens);
                    parent.value = parent.value + "\n" + node.value;

                    console.log(node.tokens + ", " + node.value);
                }else{
                    console.log('Error: invalid statement no parent for node');
                }
                break;
            default:
                if(node.type.length == 0){
                    parent = nodeStack.peek();
                    if(parent){
                        parent.tokens = parent.tokens.concat(node.tokens);
                        parent.value = parent.value + node.value;

                        console.log(node.tokens + ", " + node.value);
                    }else{
                        console.log('Error: invalid statement no parent for node');
                    }
                }
                
        }
    }
    return jobNode;
}

//function to expand all the procs in jcl
function procExpansion(inputjcl :string){
    let lines = inputjcl.split('\n');

    let expandedJcl = lines;
    let outputJcl = "";

    let procregex :RegExp = /\/\/[A-Z0-9#@$]+[ ]+EXEC[ ]+[A-Z0-9#@$]+,/g;

    for(let line of lines){
        let match = line.match(procregex);
        if(match){
            console.log("Matched proc", match[0])
            // let procName = match[0].split(' ')[0];
            // let proc = procMap[procName];
            // let procLines = proc.split('\n');
            // expandedJcl = expandedJcl.concat(procLines);
        }
    }
    return outputJcl;
}

function structureJCL(input: string) :Node{
    input = removeCommentsandEmptyLines(input);
    console.log(input)
    let regex : RegExp = /\/\/[A-Z0-9$@#]+[ ]+[A-Z]+[ ]+/g;
    let lines : string[] | null = input.split(regex);
    lines.splice(0, 1);
    let matches :RegExpMatchArray | null = input.match(regex);
    //console.log(lines);

    let matchesArray :string[] = [];    
    matches?.forEach((match) => {
        if(match != "\n"){
            matchesArray.push(match);
        }
    });

    let stack :Stack<Node> = new Stack<Node>();

    let match = matchesArray[0].trim().split(' ');
    let root :Node = new Node(match[0], match[match.length - 1], lines[0]);
    stack.push(root);

    for(let i = 1; i < matchesArray.length; i++){
        console.log(matchesArray[i], lines[i]);

        let match = matchesArray[i].trim().split(' ');
        let node :Node = new Node(match[0], match[match.length - 1], lines[i]);
        
        let setregex :RegExp = /\/\/.+(SET)[ ]+/g;
        let setmatches :string[] = lines[i].split(setregex);
        if(setmatches){
           for(let setindx = 1; setindx < setmatches.length; setindx++){
               set token
               let setmatch = setmatches[setindx].trim().split('=');
               node.setProperties(setmatch[0], setmatch[1]);
           }
        }


        if(!stack.isEmpty()){
            if(stack.peek()?.type === 'DD'){
                stack.peek()?.children.push(node);
            }else{
                if(node.type === 'EXEC'){
                    while(stack.peek()?.type === 'EXEC'){
                        stack.pop();
                    }
                    stack.peek()?.children.push(node);
                    stack.push(node);
                }else{
                    stack.peek()?.children.push(node);
                }
            }
        }else{
            console.log("Empty stack");
        }
    }

    return root;
}

function removeCommentsandEmptyLines(input: string) :string{
    let lines = input.split('\n');
    let output = "";
    for(let line of lines){
        if(line.trim() === '' || line.trim().startsWith('//*')) continue;
        output += line + '\n';
    }
    return output;

}


function getTokens(input: string) :string[]{
   let parser :Parser = new Parser();
   parser.init(input);
   parser.parse();
   return parser.tokens;
}

// let node :Node = parseJcl(jclString);
// fs.writeFileSync('jcl.json', JSON.stringify(node, null, 2));

//procExpansion(jclString);

fs.writeFileSync('jcl.json', JSON.stringify(structureJCL(jclString), null, 2));



