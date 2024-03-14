var JobStatement = /** @class */ (function () {
    function JobStatement() {
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
    return JobStatement;
}());
function parseJobStatement(jclString) {
    var parsedParams = new JobStatement();
    // Extract job name
    var match = jclString.match(/\/\/(\w+)\s+JOB/);
    if (match) {
        parsedParams.jobName = match[1];
    }
    // Extract other parameters
    var paramPairs = jclString.matchAll(/(\w+)\s*=\s*'([^']*)'/g);
    for (var _i = 0, paramPairs_1 = paramPairs; _i < paramPairs_1.length; _i++) {
        var _a = paramPairs_1[_i], key = _a[1], value = _a[2];
        parsedParams[(key.toLowerCase() + "Param")] = value;
    }
    return parsedParams;
}
// Example JCL string
var jclString = "//MYJOB JOB (123), 'MYUSER', CLASS=A, MSGCLASS=H, NOTIFY=&SYSUID";
// Parse the JCL string
var parsedJob = parseJobStatement(jclString);
// Print the parsed JSON object
console.log(JSON.stringify(parsedJob, null, 2));
