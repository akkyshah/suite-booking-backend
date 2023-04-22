import * as App from "./src/app/app";
import * as Winston from "./src/core/winston"
import * as Config from "./src/shared/config";
import {LocalEnvironment} from "./src/core";

const logger = Winston.getLogger(module.filename);

const forceClose = (error: Error) => {
  logger.error(error);
  console.log("initialize error - forcefully exiting the process");
  process.exit(1);
};

try {
  LocalEnvironment.load();

  Winston.configure(Config.getAppConfig().appName);

  Config.initialize();

  App.initialize().then().catch((error: Error) => forceClose(error));
} catch (error: any) {
  forceClose(error);
}
