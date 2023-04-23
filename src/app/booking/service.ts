import {RunResult} from "sqlite3";
import {BookingStatus, IUnsavedBooking} from "@custom-types";
import {BookingDb, MAX_BOOKING_DAYS_LIMIT} from "@/app/booking/db";
import {Sqlite3, Utility} from "@/shared";
import {MomentAbstract} from "@/core";
import {HttpError} from "@/core/http";
import {Err} from "@/constants";
import {StatusCode} from "@custom-types/core";

export default class BookingService {

  static async save(booking: IUnsavedBooking) {
    return new Promise((resolve, reject) => {
      const bookingId = Utility.createUniqueRandomAlphaNumericId();
      const insertData = {
        [BookingDb.column.id]: bookingId,
        [BookingDb.column.email]: booking.email,
        [BookingDb.column.firstName]: booking.firstName,
        [BookingDb.column.lastName]: booking.lastName,
        [BookingDb.column.noOfGuests]: booking.noOfGuests,
        [BookingDb.column.startDate]: booking.startDate,
        [BookingDb.column.endDate]: booking.endDate,
        [BookingDb.column.status]: BookingStatus.BOOKED
      };
      Sqlite3.getDb().run(`
                  INSERT INTO ${BookingDb.tableName} (${Object.keys(insertData).join(",")})
                  VALUES (${Object.keys(insertData).map(_ => ("?")).join(",")})
        `,
        Object.values(insertData),
        (_: RunResult, error: Error | null) => {
          if (error) return reject(error);
          resolve({
            bookingId: bookingId,
            status: insertData[BookingDb.column.status]
          });
        });
    })
  }

  /**
   * @param startDateStr: yyyy-mm-dd
   * @param endDateStr: yyyy-mm-dd
   * */
  static async assertValidBookingTimeSlot(startDateStr: string, endDateStr: string) {
    const startDate = new MomentAbstract(startDateStr);
    const endDate = new MomentAbstract(endDateStr);

    const daysDiff = endDate.diff(startDate, "days");
    if (daysDiff < 0) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1001.errCode, Err.V_B_1001.msg);
    } else if (daysDiff === 0) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1002.errCode, Err.V_B_1002.msg);
    } else if (daysDiff > MAX_BOOKING_DAYS_LIMIT) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1003.errCode, Err.V_B_1003.msg);
    } else {
      const currentDate = new MomentAbstract();
      const daysDiff = startDate.diff(currentDate, "days");
      if (daysDiff < 0) {
        throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1004.errCode, Err.V_B_1004.msg);
      } else if (daysDiff === 0) {
        throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1005.errCode, Err.V_B_1005.msg);
      } else if (daysDiff > 30) {
        throw new HttpError(StatusCode.BAD_REQUEST, Err.V_B_1006.errCode, Err.V_B_1006.msg);
      }
    }
  }
}
