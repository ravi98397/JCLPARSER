declare class JobStatement {
    jobName: string;
    accountingInfo: string;
    classParam: string;
    msgClassParam: string;
    msgLevelParam: string;
    notifyParam: string;
    timeParam: string;
    regionParam: string;
    prtyParam: string;
    condParam: string;
    rdParam: string;
    passwordParam: string;
    groupParam: string;
    userParam: string;
    addrspcParam: string;
    bytesParam: string;
    linesParam: string;
    memlimitParam: string;
    jeslogParam: string;
    jobrcParam: string;
    systemParam: string;
    typrunParam: string;
    schenvParam: string;
    seclabelParam: string;
    ccsidParam: string;
    cardsParam: string;
    dsenqshrParam: string;
}
declare function parseJobStatement(jclString: string): JobStatement;
declare const jclString = "//MYJOB JOB (123), 'MYUSER', CLASS=A, MSGCLASS=H, NOTIFY=&SYSUID";
declare const parsedJob: JobStatement;
