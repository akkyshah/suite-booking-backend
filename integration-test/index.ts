import chai from "chai";
import chaiHttp from "chai-http";
import * as App from "../src/app/app";
import * as Config from "../src/shared/config";
import {Sqlite3} from "@/shared/sqlite3";
import {SuperAgent} from "./utils/superAgent";

chai.use(chaiHttp);

const testConfig = {
  developmentMode: true,
  serverPort: 18081,
  logLevel: "info",
  dbName: "booking-test"
};

before(async function () {
    SuperAgent.setHttpServerUrl(`http://localhost:${testConfig.serverPort}`);
    Config.__setTestConfig(testConfig);
    await App.initialize();
  }
);

// IDEs sorts the imports, hence here we have used `require(...)` statements instead of imports.
require("./modules/health");

after(async () => {
  await App.stop();
  await Sqlite3.__dropTable();
});
