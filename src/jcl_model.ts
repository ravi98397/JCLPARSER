class JobStatement {
    jobName: string = ""; // Job Name (JOBNAME)
    accountingInfo: string = ""; // Accounting Information
    classParam: string = ""; // CLASS Parameter
    msgClassParam: string = ""; // MSGCLASS Parameter
    msgLevelParam: string = ""; // MSGLEVEL Parameter
    notifyParam: string = ""; // NOTIFY Parameter
    timeParam: string = ""; // TIME Parameter
    regionParam: string = ""; // REGION Parameter
    prtyParam: string = ""; // PRTY Parameter
    condParam: string = ""; // COND Parameter
    rdParam: string = ""; // RD Parameter
    passwordParam: string = ""; // PASSWORD Parameter
    groupParam: string = ""; // GROUP Parameter
    userParam: string = ""; // USER Parameter
    addrspcParam: string = ""; // ADDRSPC Parameter
    bytesParam: string = ""; // BYTES Parameter
    linesParam: string = ""; // LINES Parameter
    memlimitParam: string = ""; // MEMLIMIT Parameter
    jeslogParam: string = ""; // JESLOG Parameter
    jobrcParam: string = ""; // JOBRC Parameter
    systemParam: string = ""; // SYSTEM Parameter
    typrunParam: string = ""; // TYPRUN Parameter
    schenvParam: string = ""; // SCHENV Parameter
    seclabelParam: string = ""; // SECLABEL Parameter
    ccsidParam: string = ""; // CCSID Parameter
    cardsParam: string = ""; // CARDS Parameter
    dsenqshrParam: string = ""; // DSENQSHR Parameter
}

function parseJobStatement(jclString: string): JobStatement {
    const parsedParams: JobStatement = new JobStatement();

    // Extract job name
    const match = jclString.match(/\/\/(\w+)\s+JOB/);
    if (match) {
        parsedParams.jobName = match[1];
    }

    // Extract other parameters
    const paramPairs = jclString.matchAll(/(\w+)\s*=\s*'([^']*)'/g);
    for (const [, key, value] of paramPairs) {
        parsedParams[(key.toLowerCase() + "Param") as keyof(JobStatement)] = value;
    }

    return parsedParams;
}

// Example JCL string
const jclString = "//MYJOB JOB (123), 'MYUSER', CLASS=A, MSGCLASS=H, NOTIFY=&SYSUID";

// Parse the JCL string
const parsedJob = parseJobStatement(jclString);

// Print the parsed JSON object
console.log(JSON.stringify(parsedJob, null, 2));
