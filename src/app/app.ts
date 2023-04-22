import NestedError from "nested-error-stacks";
import * as Winston from "../core/winston"
import {Config} from "@/shared";
import {LocalEnvironment} from "@/core";

const logger = Winston.getLogger(module.filename);

export const initialize = async () => {
  try {
    LocalEnvironment.load();
    Winston.configure(Config.getAppConfig().appName);

    await Config.initialize();
    const appConfig = Config.getAppConfig();

    Winston.configure(appConfig.appName, appConfig.logLevel);
  } catch (error: any) {
    throw error;
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
