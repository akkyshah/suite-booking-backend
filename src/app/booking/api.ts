import express, {NextFunction, Request, Response} from "express";
import NestedError from "nested-error-stacks";
import * as Server from "@/core/http/server";
import {StatusCode} from "@custom-types/core";
import BookingService from "@/app/booking/service";
import {asyncQueue} from "@/core/http/express-middlewares";
import {MomentAbstract} from "@/core";
import {HttpError} from "@/core/http";
import {Err} from "@/constants";

const router = express.Router();

/**
 * Request Body: {email, firstName, lastName, noOfGuests, startDate: yyyy-mm-dd, endDate: yyyy-mm-dd}
 * Success Response: {bookingId, status}
 * Error Responses: Either of (P_B_1000, V_B_1001, V_B_1002, V_B_1003, V_B_1004, V_B_1005, V_B_1006, V_B_1007)
 * */
export const _httpPostBooking = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;

    BookingService.sanitizeHttpPostBookingRequest(body);

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
router.post("/", asyncQueue(_httpPostBooking));

/**
 * Request query: { [startDate: yyyy-mm-dd], [endDate: yyyy-mm-dd}]}
 * Success Response: { availabilities: [{from, to}, ...] }
 * Error Responses: Either of (G_AV_B_1001, G_AV_B_1002)
 * */
export const _httpGetAvailableBookingSlots = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const query = request.query;

    const minimumStartDate = new MomentAbstract().add(2, "days").startOfTheDay();  // since user cannot book a slot less than 24-hours. so, this is min startDate for possible booking.

    let startDate = minimumStartDate;
    if (query.startDate) {
      const queryStartDate = new MomentAbstract(query.startDate as string);
      if (queryStartDate.diff(minimumStartDate, "days") <= 1) {
        throw new HttpError(StatusCode.BAD_REQUEST, Err.G_AV_B_1001.errCode, Err.G_AV_B_1001.msg);
      }
      startDate = queryStartDate;
    }

    const endDate = query.endDate ? new MomentAbstract(query.endDate as string) : new MomentAbstract(startDate.valueOf()).add(30, "days");
    if (endDate.isBefore(startDate)) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.G_AV_B_1002.errCode, `end date cannot be less than ${startDate.toDateString()}`)
    }

    const availabilities = await BookingService.getAvailableBookings(startDate.toDateString(), endDate.toDateString());

    response.status(StatusCode.OK).json({availabilities: availabilities});
  } catch (error: any) {
    next(new NestedError(`error fetching available slots`, error));
  }
};
router.get("/availabilities", _httpGetAvailableBookingSlots);

/**
 * Request params: {bookingId}
 * Success Response: { booking: IHttpBooking }
 * Error Responses: Either of (B_ID_1001)
 * */
export const _httpGetBookingById = async (request: Request, response: Response, next: NextFunction) => {
  const bookingId = request.params.bookingId;
  try {
    const dbBooking = await BookingService.getBookingById(bookingId);
    response.status(StatusCode.OK).json({booking: BookingService.toHttp(dbBooking)});
  } catch (error: any) {
    next(new NestedError(`error fetching booking by id: ${bookingId}`, error));
  }
};
router.get("/:bookingId", _httpGetBookingById);

/**
 * Request params: {bookingId}
 * Request body: { [email], [firstName], [lastName], [noOfGuests], [startDate], [endDate] }
 * Success Response: {success: true}
 * Error Responses: Either of (
 *      B_ID_1001, U_B_ID_1001, U_B_ID_1002,
 *      V_B_1001, V_B_1002, V_B_1003, V_B_1004, V_B_1005, V_B_1006, V_B_1007
 *  )
 * */
export const _httpUpdateBookingById = async (request: Request, response: Response, next: NextFunction) => {
  const bookingId = request.params.bookingId;
  const body = request.body;
  try {
    BookingService.sanitizeHttpPatchUpdateBookingRequest(body);

    const dbBooking = await BookingService.getBookingById(bookingId);

    if (body.startDate || body.endDate) {
      const startDate = body.startDate || dbBooking.startDate;
      const endDate = body.endDate || dbBooking.endDate;
      await BookingService.assertValidBookingTimeSlot(startDate, endDate, dbBooking.id);
    }

    await BookingService.updateBooking(bookingId, body);

    response.status(StatusCode.OK).json({success: true});
  } catch (error: any) {
    next(new NestedError(`error updating booking by id: ${bookingId}`, error));
  }
};
router.patch("/:bookingId", asyncQueue(_httpUpdateBookingById));

export const addHttpEndPoints = () => {
  Server.bindApi("/booking", router)
};
