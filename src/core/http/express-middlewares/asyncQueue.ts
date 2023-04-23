import {NextFunction, Request, Response} from "express";
import async from "async";

const queue = async.queue(async ({handler, request, response, next}, callback) => {
  await handler(request, response, next);
  callback();
}, 1);

export const asyncQueue = (apiHandler: (request: Request, response: Response, next: NextFunction) => void) => {
  const apiHandlerWrapper = async (request: Request, response: Response, next: NextFunction) => {
    await queue.push({handler: apiHandler, request, response, next});
  };
  return apiHandlerWrapper;
}
