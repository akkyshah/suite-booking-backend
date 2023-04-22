import * as App from "./src/app/app";
import * as Winston from "./src/core/winston"

const logger = Winston.getLogger(module.filename);

const forceClose = (error: Error) => {
  logger.error(error);
  console.log("initialize error - forcefully exiting the process");
  process.exit(1);
};

try {
  App.initialize().then().catch((error: Error) => forceClose(error));
} catch (error: any) {
  forceClose(error);
}
