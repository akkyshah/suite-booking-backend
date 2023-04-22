import {NextFunction, Request, Response} from "express";
import * as Winston from "../../winston"
import {StatusCode} from "@custom-types/core";
import NestedError from "nested-error-stacks";

const logger = Winston.getLogger(module.filename);

/**
 * If nodejs crashes and response is not sent due to some internal error;
 * then this middleware will be called to return 500 internal error with an appropriate message.
 *
 * If error is instance of NestedError, we will recursively loop into the nested stack to respond with internal cause.
 * */
const getHttpError = (err: any, depth: number = 0): { statusCode: number, errCode: string | undefined, message: string } => {
  if (typeof err === "string") {
    return {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      errCode: undefined,
      message: err
    }
  } else if (err instanceof NestedError) {
    // @ts-ignore
    const nestedErr = err.nested;
    if (nestedErr) {
      return getHttpError(nestedErr, depth + 1);
    } else {
      return {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        errCode: undefined,
        message: err.message
      }
    }
  } else if (err instanceof Error) {
    return {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      errCode: undefined,
      message: err.message
    };
  } else {
    return {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      errCode: undefined,
      message: "internal server error"
    }
  }
}

const errorHandler = (error: any, _: Request, response: Response, next: NextFunction) => {
  if (!error) {
    return next();
  }
  logger.error(error);
  const errorJson = getHttpError(error);
  response.status(errorJson.statusCode).json({statusCode: errorJson.statusCode, errCode: errorJson.errCode, message: errorJson.message});
}

export default errorHandler;
