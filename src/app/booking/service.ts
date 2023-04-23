import {RunResult} from "sqlite3";
import {BookingStatus, IDbBooking, IHttpBooking, ISlot, IUnsavedBooking} from "@custom-types";
import {BookingDb, MAX_BOOKING_DAYS_LIMIT} from "@/app/booking/db";
import {Sqlite3, Utility} from "@/shared";
import {MomentAbstract} from "@/core";
import {HttpError} from "@/core/http";
import {Err} from "@/constants";
import {StatusCode} from "@custom-types/core";
import {SaveBookingRequestBody, UpdateBookingRequestBody} from "@/app/booking/joi";

export default class BookingService {

  static sanitizeHttpPostBookingRequest(requestBody: any) {
    const result = SaveBookingRequestBody.validate(requestBody)
    if (result.error) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.P_B_1000.errCode, result.error.message)
    }
  }

  static sanitizeHttpPatchUpdateBookingRequest(requestBody: any) {
    const result = UpdateBookingRequestBody.validate(requestBody)
    if (result.error) {
      throw new HttpError(StatusCode.BAD_REQUEST, Err.U_B_ID_1002.errCode, result.error.message)
    }
  }

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
            status: "booked"
          });
        });
    })
  }

  static async updateBooking(bookingId: string, booking: Partial<IUnsavedBooking>) {
    return new Promise((resolve, reject) => {

      const updatedData: any = {};
      if (booking.email) updatedData[BookingDb.column.email] = booking.email;
      if (booking.firstName) updatedData[BookingDb.column.firstName] = booking.firstName;
      if (booking.lastName) updatedData[BookingDb.column.lastName] = booking.lastName;
      if (booking.noOfGuests) updatedData[BookingDb.column.noOfGuests] = booking.noOfGuests;
      if (booking.startDate) updatedData[BookingDb.column.startDate] = booking.startDate;
      if (booking.endDate) updatedData[BookingDb.column.endDate] = booking.endDate;

      if (Object.keys(updatedData).length === 0) {
        throw new HttpError(StatusCode.BAD_REQUEST, Err.U_B_ID_1001.errCode, Err.U_B_ID_1001.msg);
      }

      Sqlite3.getDb().run(`
                  UPDATE ${BookingDb.tableName}
                  SET ${Object.keys(updatedData).map(key => (`${key} = ?`)).join(",")}
                  WHERE ${BookingDb.column.id} = ?
        `,
        [...Object.values(updatedData), bookingId],
        (error: Error | null) => {
          if (error) return reject(error);
          resolve(undefined);
        });
    })
  }

  static async getBookingById(bookingId: string): Promise<IDbBooking> {
    return new Promise((resolve, reject) => {
      Sqlite3.getDb().get(`
          SELECT *
          FROM ${BookingDb.tableName}
          WHERE ${BookingDb.column.id} = ?
      `, [bookingId], (error: Error | null, rows) => {
        if (error) return reject(error);
        if (!rows) {
          reject(new HttpError(StatusCode.BAD_REQUEST, Err.B_ID_1001.errCode, Err.B_ID_1001.msg));
        } else {
          resolve(rows as IDbBooking)
        }
      })
    })
  }

  /**
   * @return true if `startDate` and `endDate` does not overlap any existing booking dates. otherwise false.
   * */
  static async isAnyConflictingBookingExist(startDate: string, endDate: string, exceptBookingId?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Sqlite3.getDb().get(`
          SELECT *
          FROM ${BookingDb.tableName}
          WHERE ${BookingDb.column.status} = ? ${exceptBookingId ? `AND ${BookingDb.column.id} != '${exceptBookingId}'` : ""}
            AND (
                    (? >= ${BookingDb.column.startDate} AND ? < ${BookingDb.column.endDate})
                    OR (? > ${BookingDb.column.startDate} AND ? <= ${BookingDb.column.endDate})
                    OR (? < ${BookingDb.column.startDate} AND ? > ${BookingDb.column.endDate})
            )
          ORDER BY DATETIME(${BookingDb.column.startDate}) ASC
      `, [BookingStatus.BOOKED, startDate, startDate, endDate, endDate, startDate, endDate], (error: Error | null, rows) => {
        if (error) return reject(error);
        resolve(!!rows)
      })
    })
  }

  /**
   * @param startDateStr: yyyy-mm-dd
   * @param endDateStr: yyyy-mm-dd
   * @param exceptBookingId: string
   * */
  static async assertValidBookingTimeSlot(startDateStr: string, endDateStr: string, exceptBookingId?: string) {
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

    const isBookingConflict = await BookingService.isAnyConflictingBookingExist(startDateStr, endDateStr, exceptBookingId);
    if (isBookingConflict) {
      throw new HttpError(StatusCode.NOT_ACCEPTABLE, Err.V_B_1007.errCode, Err.V_B_1007.msg);
    }
  }

  private static async getBookings(startDate: string, endDate: string): Promise<IDbBooking[]> {
    return new Promise((resolve, reject) => {
      Sqlite3.getDb().all(`
          SELECT *
          FROM ${BookingDb.tableName}
          WHERE ${BookingDb.column.status} = ?
            AND ${BookingDb.column.startDate} >= ?
            AND ${BookingDb.column.endDate} <= ?
          ORDER BY DATETIME(${BookingDb.column.startDate}) ASC
      `, [BookingStatus.BOOKED, startDate, endDate], (error: Error | null, rows) => {
        if (error) return reject(error);
        resolve(rows ? rows as IDbBooking[] : [])
      })
    })
  }

  static async getAvailableBookings(startDate: string, endDate: string): Promise<ISlot[]> {
    const bookings = await BookingService.getBookings(startDate, endDate);
    const bookedSlots: ISlot[] = bookings.map((booking: IDbBooking) => ({
      from: booking.startDate,
      to: booking.endDate,
    }));
    return Utility.mergeSubsequentSlots(startDate, endDate, bookedSlots);
  }

  /**
   * Usually we would do following as per our practice:
   *  1. Flat any JS object (Ex: Date / Moment) to a required-string-format or any primitive-datatype
   *  2. Change data shape if needed
   *  2. Hide internal DB fields
   *  3. Rename the column names to prevent disclosing our database fields and conventions (for simplicity, currently we are keeping them as it is)
   *  4. Transform values to simplified form
   * */
  static toHttp(booking: IDbBooking): IHttpBooking {
    return {
      id: booking.id,
      email: booking.email,
      firstName: booking.firstName,
      lastName: booking.lastName,
      noOfGuests: booking.noOfGuests,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status === BookingStatus.BOOKED ? "booked" : "cancelled",
    };
  }
}
