import coreJoi from "joi";
import joiDate from "@joi/date";

const Joi = coreJoi.extend(joiDate) as typeof coreJoi;

export const SaveBookingRequestBody = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  noOfGuests: Joi.number().required().min(1).max(3),
  startDate: Joi.date().format("YYYY-MM-DD").required(),
  endDate: Joi.date().format("YYYY-MM-DD").required()
}).required();
