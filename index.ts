import * as App from "./src/app/app";

const forceClose = (error: Error) => {
  console.error(error);
  console.log("initialize error - forcefully exiting the process");
  process.exit(1);
};

try {
  App.initialize().then().catch((error: Error) => forceClose(error));
} catch (error: any) {
  forceClose(error);
}
