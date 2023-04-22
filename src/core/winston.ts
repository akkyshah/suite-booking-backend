import path from "path";
import * as Winston from "winston";
import {Logger} from "winston";

const CONSOLE_LOG_COLORS: any = {
  debug: "\x1b[0m", // black
  info: "\x1b[0m", // black
  error: "\x1b[31m", // red
  warn: "\x1b[33m", // yellow
  verbose: "\x1b[43m",  // yellow-background
};
const CONSOLE_TEXT_BLACK_COLOR = "\x1b[0m";

let appName: string;
let logLevel: string;
let winston: Logger;

export const configure = (applicationName: string, loggingLevel: string = "info") => {
  appName = applicationName;
  logLevel = loggingLevel.toLowerCase();
  initLogger();
  configureConsoleLogging();
  getLogger(module.filename).info(`Setting log level: ${logLevel}`);
}

const initLogger = () => {
  if (winston) {
    removeAllTransports();
    winston.configure({
      exitOnError: false,
      level: logLevel,
      format: Winston.format.json()
    });
  } else {
    winston = Winston.createLogger({
      exitOnError: false,
      level: logLevel,
      format: Winston.format.json()
    });
  }
};

const removeAllTransports = () => {
  winston.clear();
};

const configureConsoleLogging = () => {
  winston.add(new Winston.transports.Console({
    level: logLevel,
    handleExceptions: true,
    format: Winston.format.combine(
      Winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss:SSS'
      }),
      Winston.format.label({label: appName.toLocaleUpperCase()}),
      Winston.format.printf(logMessageJsonToConsoleTextConverter),
    ),
  }));
};

const logMessageJsonToConsoleTextConverter = (logMessage: any) => {
  const {level, message, fileName, label, timestamp, errorStack} = logMessage;
  const logColor = CONSOLE_LOG_COLORS[level];
  return `${logColor}`
    + `${timestamp} ${label} ${level.toLocaleUpperCase()} ${fileName}: ${errorStack ? errorStack : message}`
    + `${logMessage.code ? "\ncode: " + logMessage.code : ""}`
    + `${logMessage.errno ? "\nerrno: " + logMessage.errno : ""}`
    + `${logMessage.syscall ? "\nsyscall: " + logMessage.syscall : ""}`
    + `${logMessage.address ? "\naddress: " + logMessage.address : ""}`
    + `${logMessage.port ? "\nport: " + logMessage.port : ""}`
    + `${CONSOLE_TEXT_BLACK_COLOR}`;
};

export const getLogger = (moduleName: any) => {
  const baseName = path.parse(moduleName).name;
  return {
    verbose: (log: any) => winston?.verbose(log, {fileName: baseName}),
    debug: (log: any) => winston?.debug(log, {fileName: baseName}),
    info: (log: any) => winston?.info(log, {fileName: baseName}),
    warn: (log: any) => winston?.warn(log, {fileName: baseName}),
    error: (log: Error) => winston?.error(log.message, {fileName: baseName, errorStack: log.stack}),
  }
}
