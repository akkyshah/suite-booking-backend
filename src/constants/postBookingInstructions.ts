export const getPostBookingInstructions = (serverPort: number, bookingId: string) => {
  return {
    "get-booking": {
      instruction: "get your booking information by calling our API with your bookingId",
      api: `GET - http://localhost:${serverPort}/api/booking/${bookingId}`
    },
    "update-booking": {
      instruction: "update your booking information by calling our API with your bookingId " +
        "and passing any of the following information in request body (firstName, lastName, email, noOfGuests, startDate, endDate)",
      api: `PATCH - http://localhost:${serverPort}/api/booking/${bookingId}`
    },
    "cancel-booking": {
      instruction: "call our patch API with your booking id to cancel your booking",
      api: `PATCH - http://localhost:${serverPort}/api/booking/cancel/${bookingId}`
    },
  }
}
