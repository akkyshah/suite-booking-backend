import NestedError from "nested-error-stacks";
import * as Winston from "../core/winston"
import {Config, Sqlite3} from "@/shared";
import {Server} from "@/core/http";
import * as Health from "./health/api";
import * as Booking from "@/app/booking/api";

const logger = Winston.getLogger(module.filename);

export const initialize = async () => {
  try {
    Sqlite3.init(Config.getDbConfig().dbName);

    const appConfig = Config.getAppConfig();
    Winston.configure(appConfig.appName, appConfig.logLevel);

    Server.configure(Config.getBooleanDevelopmentMode());

    Health.addHttpEndPoints();
    Booking.addHttpEndPoints();

    await Server.start(Config.getServerConfig().serverPort);

  } catch (error: any) {
    throw error;
  }
};

export const stop = async () => {
  logger.info("stopping " + Config.getAppConfig().appName);
  try {
    await Server.stop();
  } catch (error: any) {
    logger.error(error);
  }
};

process.on("SIGINT", async () => {
  logger.info("received SIGINT");
  await stop();
});

process.on("SIGTERM", async () => {
  logger.info("received SIGTERM");
  await stop();
});

process.on("uncaughtException", error => {
  logger.error(new NestedError("uncaughtException: ", error));
});
