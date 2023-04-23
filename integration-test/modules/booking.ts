import chai from "chai";
import {StatusCode} from "@custom-types/core";
import {SuperAgent} from "../utils/superAgent";
import {MomentAbstract} from "@/core";

const assert = chai.assert;

describe("Booking", () => {
  const TestData: any = {
    bookingParams1: {
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      noOfGuests: 3,
      startDate: new MomentAbstract().add(10, "days").startOfTheDay().toDateString(),
      endDate: new MomentAbstract().add(13, "days").startOfTheDay().toDateString()
    }
  }

  it("save booking with appropriate data successfully returns statusCode 200 with and unique booking identifier", async () => {
    const response = await SuperAgent.newHttpPostRequest("/api/booking").send(TestData.bookingParams1);
    assert.equal(StatusCode.OK, response.status);
    assert.exists(response.body.bookingId);
  });
});
