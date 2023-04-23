import {MAX_BOOKING_DAYS_LIMIT} from "@/app/booking/db";

export const Err = {
  V_B_1001: {
    errCode: "V_B_1001",
    msg: "booking start date cannot be greater than end date"
  },
  V_B_1002: {
    errCode: "V_B_1002",
    msg: "booking start date and end date cannot be the same"
  },
  V_B_1003: {
    errCode: "V_B_1003",
    msg: `your booking cannot exceed more than ${MAX_BOOKING_DAYS_LIMIT} days`
  },
  V_B_1004: {
    errCode: "V_B_1004",
    msg: "booking start date cannot be a past date"
  },
  V_B_1005: {
    errCode: "V_B_1005",
    msg: "booking cannot be done for start date less than 24 hours from current date"
  },
  V_B_1006: {
    errCode: "V_B_1006",
    msg: "you cannot make an advance booking preceding more than 30 days"
  }
}