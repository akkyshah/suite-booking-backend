import chai from "chai";
import {StatusCode} from "@custom-types/core";
import {SuperAgent} from "../utils/superAgent";
import {MomentAbstract} from "@/core";
import {Err} from "@/constants";

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
    },
    bookingParams2: {
      email: "leo@example.com",
      firstName: "Leo",
      lastName: "Campbell",
      noOfGuests: 2,
      startDate: new MomentAbstract().add(15, "days").startOfTheDay().toDateString(),
      endDate: new MomentAbstract().add(17, "days").startOfTheDay().toDateString()
    },
    bookingParams3: {
      email: "alex@example.com",
      firstName: "Alex",
      lastName: "Brown",
      noOfGuests: 1,
      startDate: new MomentAbstract().add(10, "days").startOfTheDay().toDateString(),
      endDate: new MomentAbstract().add(12, "days").startOfTheDay().toDateString()
    },
  }

  it("save booking with appropriate data successfully returns statusCode 200 with and unique booking identifier", async () => {
    const response = await SuperAgent.newHttpPostRequest("/api/booking").send(TestData.bookingParams1);
    assert.equal(StatusCode.OK, response.status);
    assert.exists(response.body.bookingId);
    assert.equal(response.body.status, "booked");
  });

  it("save booking with start-date and end-date conflicting with another booking returns error with statusCode 406", async () => {
    const response = await SuperAgent.newHttpPostRequest("/api/booking").send(TestData.bookingParams3);
    assert.equal(response.status, StatusCode.NOT_ACCEPTABLE);
    assert.equal(response.body.errCode, Err.V_B_1007.errCode);
    assert.equal(response.body.message, Err.V_B_1007.msg);
  });

  it("save booking with more than 3 guests returns error with statusCode 400", async () => {
    const response = await SuperAgent.newHttpPostRequest("/api/booking").send({...TestData.bookingParams2, noOfGuests: 10});
    assert.equal(response.status, StatusCode.BAD_REQUEST);
    assert.equal(response.body.errCode, Err.P_B_1000.errCode);
    assert.equal(response.body.message, "\"noOfGuests\" must be less than or equal to 3");
  });

  it("save booking with start-date and end-date not conflicting with any other booking returns success with unique booking identifier", async () => {
    const response = await SuperAgent.newHttpPostRequest("/api/booking").send(TestData.bookingParams2);
    assert.equal(StatusCode.OK, response.status);
    assert.exists(response.body.bookingId);
    assert.equal(response.body.status, "booked");
  });
});
