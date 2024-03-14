"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var jclString = "//MYJOB  JOB  (123),'MY USER',CLASS=A,MSGCLASS=H,NOTIFY=&SYSUID\n//JSTEP020 EXEC PGM=ICETOOL\n//TOOLMSG DD SYSOUT=*\n//DFSMSG DD SYSOUT=*\n//IN1 DD DSN=MYDATA.URMI.STOPAFT,DISP=SHR\n//OUT1 DD SYSOUT=*\n//TOOLIN DD *\nCOPY FROM(IN1) TO(OUT1) USING(CTL1)\n/*\n//CTL1CNTL DD *\nOPTION STOPAFT=10\n/*\n";
var parser = new parser_1.Parser();
for (var _i = 0, _a = jclString.split('\n'); _i < _a.length; _i++) {
    var line = _a[_i];
    console.log('Parsing line:', line);
    parser.init(line);
    parser.parse();
}
