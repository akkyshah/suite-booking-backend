import express, {NextFunction, Request, Response} from "express";
import NestedError from "nested-error-stacks";
import * as Server from "@/core/http/server";
import {StatusCode} from "@custom-types/core";
import BookingService from "@/app/booking/service";

const router = express.Router();

/**
 * Request Body: {email, firstName, lastName, noOfGuests, startDate: yyyy-mm-dd, endDate: yyyy-mm-dd}
 * Success Response: {bookingId, status}
 * Error Responses: Either of (V_B_1001, V_B_1002, V_B_1003, V_B_1004, V_B_1005, V_B_1006)
 * */
export const _httpPostBooking = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;

    await BookingService.assertValidBookingTimeSlot(body.startDate, body.endDate);

    const bookingConfirmation = await BookingService.save({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      noOfGuests: body.noOfGuests,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    response.status(StatusCode.OK).json(bookingConfirmation);
  } catch (error: any) {
    next(new NestedError(`error saving booking`, error));
  }
};
router.post("/", _httpPostBooking);

export const addHttpEndPoints = () => {
  Server.bindApi("/booking", router)
};