import chai from "chai";
import chaiHttp from "chai-http";
import * as App from "../src/app/app";
import * as Config from "../src/shared/config";

chai.use(chaiHttp);

const testConfig = {
  developmentMode: true,
  serverPort: 18081,
  logLevel: "info"
};

before(async function () {
    Config.__setTestConfig(testConfig);
    await App.initialize();
  }
);

// TODO: run tests

after(async () => {
  await App.stop();
});
