import * as Winston from "../core/winston";

let logger: any;

const APPLICATION_NAME = "suite-booking-backend";

const CONFIGURATION: any = {
  developmentMode: {env: "DEVELOPMENT_MODE", converter: booleanConverter},
  serverPort: {env: "SERVER_PORT", converter: integerConverter},
  logLevel: {env: "LOG_LEVEL"},
  dbName: {env: "DATABASE_NAME"}
};

export const initialize = () => {
  if (!logger) logger = Winston.getLogger(module.filename);

  logger.info("reading configuration from environment variables");
  const keys = Object.keys(CONFIGURATION).sort();

  for (const [, key] of keys.entries()) {
    const entry = CONFIGURATION[key];
    const {env, converter} = entry;

    const rawValue = process.env[env];
    const value = (rawValue === undefined || rawValue === null) ? "" : rawValue;
    const valueConverter = value && converter ? converter : stringConverter;
    entry.value = valueConverter(value);

    const loggedValue = entry.sensitive ? "********" : entry.value;
    logger.info(`configuration ${entry.env} set to ${loggedValue || "--"}`);
  }
};

export const getAppConfig = () => {
  return {
    appName: APPLICATION_NAME,
    logLevel: CONFIGURATION.logLevel.value
  }
}

export const getDbConfig = () => {
  return {
    dbName: CONFIGURATION.dbName.value
  }
}

export const getBooleanDevelopmentMode = () => CONFIGURATION.developmentMode.value;

export const getServerConfig = () => {
  return {
    serverPort: CONFIGURATION.serverPort.value,
  }
}

function stringConverter(value: string) {
  return value;
}

function integerConverter(value: string) {
  return parseInt(value);
}

function booleanConverter(value: string) {
  return value === "true";
}

/**
 * NOTE: used only by tests
 * */
export const __setTestConfig = (configurations: any) => {
  Object.keys(CONFIGURATION).map(key => {
    if (configurations[key] !== undefined) {
      CONFIGURATION[key].value = configurations[key]
    }
  })
}
