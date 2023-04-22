import {LocalEnvironment} from "@/core";

export const initialize = async () => {
  try {
    LocalEnvironment.load();
  } catch (error: any) {
    throw error;
  }
};

process.on("SIGINT", async () => {
  console.log("received SIGINT");
  await stop();
});

process.on("SIGTERM", async () => {
  console.log("received SIGTERM");
  await stop();
});

process.on("uncaughtException", error => {
  console.error(error);
});
