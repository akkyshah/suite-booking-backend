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
    TestData.bookingParams1.id = response.body.bookingId;
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

  it("save booking with start-date and end-date in concurrent will create only 1 booking", function () {
    this.timeout(5000);
    return new Promise(async resolve => {
      const tasks = [];
      for (let i = 0; i < 1000; i++) {
        tasks.push(SuperAgent.newHttpPostRequest("/api/booking").send(TestData.bookingParams2));
      }
      const responses = await Promise.all(tasks);
      let successCount = 0;
      responses.map((response: any) => {
        if (response.body?.bookingId) {
          successCount++;
          assert.equal(StatusCode.OK, response.status);
          assert.exists(response.body.bookingId);
          assert.equal(response.body.status, "booked");
          TestData.bookingParams2.id = response.body.bookingId;
        } else {
          assert.equal(response.body.errCode, Err.V_B_1007.errCode);
          assert.equal(response.body.message, Err.V_B_1007.msg);
        }
      });
      assert.equal(successCount, 1);
      resolve(undefined);
    })
  });

  it("get booking by id successfully returns booking information with status=booked", async () => {
    const bookingId = TestData.bookingParams1.id;
    const response = await SuperAgent.newHttpGetRequest(`/api/booking/${bookingId}`).send();
    assert.equal(response.status, StatusCode.OK);
    assert.exists(response.body.booking);
    assert.deepEqual(response.body.booking, {...TestData.bookingParams1, status: "booked"});
  });

  it("get booking-availabilities returns statusCode 200 with list of date-ranges of booking-availability where subsequent dates are clubbed", async () => {
    const response = await SuperAgent.newHttpGetRequest(`/api/booking/availabilities`).send();
    assert.equal(response.status, StatusCode.OK);
    assert.exists(response.body.availabilities);
    assert.deepEqual(response.body.availabilities, [
      {from: new MomentAbstract().add(1, "days").endOfTheDay().add(1, "milliseconds").toDateString(), to: TestData.bookingParams1.startDate},
      {from: TestData.bookingParams1.endDate, to: TestData.bookingParams2.startDate},
      {from: TestData.bookingParams2.endDate, to: new MomentAbstract().add(31, "days").endOfTheDay().add(1, "milliseconds").toDateString()},
    ]);
  });

  it("updating a booking to postpone by 1 day by id returns statusCode 200", async () => {
    const bookingId = TestData.bookingParams1.id;
    TestData.bookingParams1.startDate = new MomentAbstract().add(11, "days").startOfTheDay().toDateString();
    const response = await SuperAgent.newHttpPatchRequest(`/api/booking/${bookingId}`).send({startDate: TestData.bookingParams1.startDate});
    assert.equal(response.status, StatusCode.OK);
    assert.isTrue(response.body.success);
  });

  it("updating a booking to increase number of guests more than 3 returns statusCode 400 with error message", async () => {
    const bookingId = TestData.bookingParams1.id;
    const response = await SuperAgent.newHttpPatchRequest(`/api/booking/${bookingId}`).send({noOfGuests: 4});
    assert.equal(response.status, StatusCode.BAD_REQUEST);
    assert.equal(response.body.errCode, Err.U_B_ID_1002.errCode);
    assert.equal(response.body.message, "\"noOfGuests\" must be less than or equal to 3");
  });

  describe("Cancel booking", () => {
    it("cancel booking by id successfully returns statusCode 200", async () => {
      const bookingId = TestData.bookingParams2.id;
      const response = await SuperAgent.newHttpPatchRequest(`/api/booking/cancel/${bookingId}`).send();
      assert.equal(response.status, StatusCode.OK);
      assert.isTrue(response.body.success);
    });

    it("perform to re-cancel a cancelled-booking by id returns statusCode 400", async () => {
      const bookingId = TestData.bookingParams2.id;
      const response = await SuperAgent.newHttpPatchRequest(`/api/booking/cancel/${bookingId}`).send();
      assert.equal(response.status, StatusCode.BAD_REQUEST);
      assert.equal(response.body.errCode, Err.U_B_ID_1003.errCode);
      assert.equal(response.body.message, Err.U_B_ID_1003.msg);
    });

    it("perform to cancel a booking by invalid id returns statusCode 400", async () => {
      const response = await SuperAgent.newHttpPatchRequest(`/api/booking/cancel/123`).send();
      assert.equal(response.status, StatusCode.BAD_REQUEST);
      assert.equal(response.body.errCode, Err.B_ID_1001.errCode);
      assert.equal(response.body.message, Err.B_ID_1001.msg);
    });
  });
});
