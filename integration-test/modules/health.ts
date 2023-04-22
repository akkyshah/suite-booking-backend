import chai from "chai";
import {SuperAgent} from "../utils/superAgent";
import {StatusCode} from "@custom-types/core";

const assert = chai.assert;

describe("health", () => {
  it("calling health endpoint must returns response 200", async () => {
    const response = await SuperAgent.newHttpGetRequest("/api/health/check").send();
    assert.equal(StatusCode.OK, response.status);
    assert.equal(response.body.success, true);
  });
});
