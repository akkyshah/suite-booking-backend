import {NextFunction, Request, Response} from "express";
import * as Winston from "../../winston"
import {HttpError} from "@/core/http";
import {StatusCode} from "@custom-types/core";
import NestedError from "nested-error-stacks";

const logger = Winston.getLogger(module.filename);

const getHttpError = (err: any, depth: number = 0): { statusCode: number, errCode: string | undefined, message: string } => {
  if (typeof err === "string") {
    return {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      errCode: undefined,
      message: err
    }
  }
  if (HttpError.isHttpError(err)) {
    return {
      statusCode: err.status,
      errCode: err.errCode,
      message: err.message
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

/**
 * If any API throws error, they must call next(...) function passing error param;
 * this middleware will handle all the errors and sends response with appropriate response-codes based on instance of error.
 * For internal crash/errors, it will respond with 500 status code.
 * For error which are instance of HttpError - it will respond with specified error code and messages.
 * */
const errorHandler = (error: any, _: Request, response: Response, next: NextFunction) => {
  if (!error) {
    return next();
  }
  logger.error(error);
  const errorJson = getHttpError(error);
  response.status(errorJson.statusCode).json({statusCode: errorJson.statusCode, errCode: errorJson.errCode, message: errorJson.message});
}

export default errorHandler;
