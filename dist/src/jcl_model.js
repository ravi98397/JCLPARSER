"use strict";
class JobStatement {
    constructor() {
        this.jobName = ""; // Job Name (JOBNAME)
        this.accountingInfo = ""; // Accounting Information
        this.classParam = ""; // CLASS Parameter
        this.msgClassParam = ""; // MSGCLASS Parameter
        this.msgLevelParam = ""; // MSGLEVEL Parameter
        this.notifyParam = ""; // NOTIFY Parameter
        this.timeParam = ""; // TIME Parameter
        this.regionParam = ""; // REGION Parameter
        this.prtyParam = ""; // PRTY Parameter
        this.condParam = ""; // COND Parameter
        this.rdParam = ""; // RD Parameter
        this.passwordParam = ""; // PASSWORD Parameter
        this.groupParam = ""; // GROUP Parameter
        this.userParam = ""; // USER Parameter
        this.addrspcParam = ""; // ADDRSPC Parameter
        this.bytesParam = ""; // BYTES Parameter
        this.linesParam = ""; // LINES Parameter
        this.memlimitParam = ""; // MEMLIMIT Parameter
        this.jeslogParam = ""; // JESLOG Parameter
        this.jobrcParam = ""; // JOBRC Parameter
        this.systemParam = ""; // SYSTEM Parameter
        this.typrunParam = ""; // TYPRUN Parameter
        this.schenvParam = ""; // SCHENV Parameter
        this.seclabelParam = ""; // SECLABEL Parameter
        this.ccsidParam = ""; // CCSID Parameter
        this.cardsParam = ""; // CARDS Parameter
        this.dsenqshrParam = ""; // DSENQSHR Parameter
    }
}
function parseJobStatement(jclString) {
    const parsedParams = new JobStatement();
    // Extract job name
    const match = jclString.match(/\/\/(\w+)\s+JOB/);
    if (match) {
        parsedParams.jobName = match[1];
    }
    // Extract other parameters
    const paramPairs = jclString.matchAll(/(\w+)\s*=\s*'([^']*)'/g);
    for (const [, key, value] of paramPairs) {
        parsedParams[(key.toLowerCase() + "Param")] = value;
    }
    return parsedParams;
}
// Example JCL string
const jclString = "//MYJOB JOB (123), 'MYUSER', CLASS=A, MSGCLASS=H, NOTIFY=&SYSUID";
// Parse the JCL string
const parsedJob = parseJobStatement(jclString);
// Print the parsed JSON object
console.log(JSON.stringify(parsedJob, null, 2));
//# sourceMappingURL=jcl_model.js.map