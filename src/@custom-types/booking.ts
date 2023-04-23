export enum BookingStatus {
  BOOKED = 1,
  CANCELLED = 2
}

export interface IDbBooking {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  noOfGuests: number,
  startDate: string,
  endDate: string,
  status: BookingStatus,
  createdOn: string,
  modifiedOn: string,
}

export interface IUnsavedBooking extends Omit<IDbBooking, "id" | "status" | "createdOn" | "modifiedOn"> {
}

export interface IHttpBooking extends Omit<IDbBooking, "createdOn" | "modifiedOn" | "status"> {
  status: string
}
