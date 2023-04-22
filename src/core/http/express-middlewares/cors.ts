import cors from "cors";
import {Utility} from "@/shared";
import * as Winston from "../../winston";

const logger = Winston.getLogger(module.filename);

const Cors = (enableDevMode: boolean) => {
  if (enableDevMode) {
    return setupCorsForDevelopmentMode();
  } else {
    return setupCorsForNonDevelopmentMode();
  }
};

export default Cors;

const setupCorsForDevelopmentMode = () => {
  logger.info("Configuring CORS for development mode");
  return cors({
    credentials: true, origin: function (_, callback) {
      callback(null, true);
    }
  });
};

const setupCorsForNonDevelopmentMode = () => {
  logger.info("Configuring CORS for non-development mode");
  return cors({
    credentials: true, origin: function (origin, callback) {
      if (!Utility.isDefined(origin) || (origin && origin.includes("<PROD_URL>"))) {
        callback(null, true);
      } else {
        callback(new Error(`origin blocked by CORS: ${origin}`));
      }
    }
  });
};
