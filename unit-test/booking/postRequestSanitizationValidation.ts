import chai from "chai";
import BookingService from "../../src/app/booking/service";
import {MomentAbstract} from "@/core";
import {HttpError} from "@/core/http";
import {Err} from "@/constants";

const assert = chai.assert;

const assertHttpError = (error: any): error is HttpError => {
  return error && typeof error === "object" && error?.errCode;
}

describe("Post request sanitization validation test", () => {
  it("invalid email throws error", () => {
    try {
      const params = {
        firstName: "abc",
        lastName: "xyz",
        email: "abcdef",
        noOfGuests: 1,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"email\" must be a valid email");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("number of guests less than 1 throws error", () => {
    try {
      const params = {
        firstName: "abc",
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 0,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"noOfGuests\" must be greater than or equal to 1");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("number of guests more than 3 throws error", () => {
    try {
      const params = {
        firstName: "abc",
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 4,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"noOfGuests\" must be less than or equal to 3");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("invalid start date format throws error", () => {
    try {
      const params = {
        firstName: "abc",
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 3,
        startDate: new MomentAbstract().toIsoString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"startDate\" must be in YYYY-MM-DD format");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("invalid end date format throws error", () => {
    try {
      const params = {
        firstName: "abc",
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 3,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toIsoString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"endDate\" must be in YYYY-MM-DD format");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("passing invalid param attribute throws error", () => {
    try {
      const params = {
        key: "value",
        firstName: "abc",
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 3,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"key\" is not allowed");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });

  it("missing firstName throws error", () => {
    try {
      const params = {
        lastName: "xyz",
        email: "abc@example.com",
        noOfGuests: 3,
        startDate: new MomentAbstract().toDateString(),
        endDate: new MomentAbstract().add(1, "days").toDateString()
      }
      const result = BookingService.sanitizeHttpPostBookingRequest(params);
      assert.isUndefined(result);
    } catch (error) {
      assert.isDefined(error);
      if (assertHttpError(error)) {
        assert.equal(error.errCode, Err.P_B_1000.errCode);
        assert.equal(error.message, "\"firstName\" is required");
      } else {
        assert.notExists(error, "Expected HttpError");
      }
    }
  });
});
