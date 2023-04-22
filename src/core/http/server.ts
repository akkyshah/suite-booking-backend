import bodyParser from "body-parser";
import Cors from "@/core/http/express-middlewares/cors";
import express from "express";
import http from "http";
import * as Winston from "../winston";

const logger = Winston.getLogger(module.filename);

export const app = express();
const server = http.createServer(app);

const BODY_MAX_SIZE = "1mb";

export const configure = (enableDevMode: boolean) => {
  app.use(bodyParser.json({limit: BODY_MAX_SIZE}));
  app.use(bodyParser.urlencoded({limit: BODY_MAX_SIZE, extended: true}));

  app.use(Cors(enableDevMode));

  app.set("trust proxy", 1);
};

export const start = async (serverPort?: number) => {
  const port = !serverPort ? 0 : serverPort;  // 0 will start server at random port
  await startHttp(port);
};

const startHttp = (port: Number) => {
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      const serverAddress: any = server.address();
      logger.info(`HTTP server started on port: ${serverAddress.port}`);
      resolve(undefined);
    }).on("error", (error: Error) => {
      reject(error);
    });
  });
};

export const stop = async () => {
  try {
    await server.close();
    logger.info(`Stopped HTTP server`);
  } catch (error: any) {
    logger.warn(`Could not stop HTTP server, error: ${error}`);
    throw error;
  }
};
