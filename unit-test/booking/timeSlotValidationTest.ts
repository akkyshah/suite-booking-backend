import chai from "chai";
import BookingService from "../../src/app/booking/service";
import {MomentAbstract} from "@/core";
import {HttpError} from "@/core/http";
import {Err} from "@/constants";

const assert = chai.assert;

const assertHttpError = (error: any): error is HttpError => {
  return error && typeof error === "object" && error?.errCode;
}

describe("Time slot validation test", () => {
  it("end date less than start date throws error", async () => {
    try {
      const startDate = new MomentAbstract().toDateString();
      const endDate = new MomentAbstract().subtract(1, "days").toDateString();
      const result = await BookingService.assertValidBookingTimeSlot(startDate, endDate);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.V_B_1001.errCode);
        assert.equal(error.message, Err.V_B_1001.msg);
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("same start date and end date throws error", async () => {
    try {
      const startDate = new MomentAbstract().toDateString();
      const endDate = new MomentAbstract().toDateString();
      const result = await BookingService.assertValidBookingTimeSlot(startDate, endDate);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.V_B_1002.errCode);
        assert.equal(error.message, Err.V_B_1002.msg);
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("difference between start date and end date greater than 3 throws error", async () => {
    try {
      const startDate = new MomentAbstract().toDateString();
      const endDate = new MomentAbstract().add(4, "days").toDateString();
      const result = await BookingService.assertValidBookingTimeSlot(startDate, endDate);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.V_B_1003.errCode);
        assert.equal(error.message, Err.V_B_1003.msg);
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("start date equal to current date throws error", async () => {
    try {
      const startDate = new MomentAbstract().toDateString();
      const endDate = new MomentAbstract().add(2, "days").toDateString();
      const result = await BookingService.assertValidBookingTimeSlot(startDate, endDate);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.V_B_1005.errCode);
        assert.equal(error.message, Err.V_B_1005.msg);
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("start date greater than 30 days from current date throws error", async () => {
    try {
      const startDate = new MomentAbstract().add(31, "days").toDateString();
      const endDate = new MomentAbstract().add(32, "days").toDateString();
      const result = await BookingService.assertValidBookingTimeSlot(startDate, endDate);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.V_B_1006.errCode);
        assert.equal(error.message, Err.V_B_1006.msg);
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });
});
