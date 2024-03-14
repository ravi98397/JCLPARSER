import { Node } from "./node";
import { Parser } from "./parser";
import { Stack } from "./stack";

const jclString = `//MYJOB  JOB  (123),'MY USER',CLASS=A,MSGCLASS=H,NOTIFY=&SYSUID
//JSTEP020 EXEC PGM=ICETOOL
//TOOLMSG DD SYSOUT=*
//DFSMSG DD SYSOUT=*
//IN1 DD DSN=MYDATA.URMI.STOPAFT,DISP=SHR
//OUT1 DD SYSOUT=*
//TOOLIN DD *
COPY FROM(IN1) TO(OUT1) USING(CTL1)
/*
//CTL1CNTL DD *
OPTION STOPAFT=10
/*
`;

const parser :Parser = new Parser();


let stack : Stack<Node> = new Stack<Node>();

for(let line of jclString.split('\n')){
    console.log('Parsing line:', line);
    parser.init(line);
    parser.parse();
}
