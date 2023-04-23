import chai from "chai";
import chaiHttp from "chai-http";
import * as App from "../src/app/app";
import * as Config from "../src/shared/config";
import {SuperAgent} from "./utils/superAgent";
import {Sqlite3} from "@/shared";

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
    await Sqlite3.__clearData();
  }
);

// IDEs sorts the imports, hence here we have used `require(...)` statements instead of imports.
require("./modules/health");
require("./modules/booking");

after(async () => {
  await App.stop();
  // NOTE: we are not deleting test database here, instead we will delete test-data on restart of these tests. This will help us to look at test-data at the end of tests.
});
