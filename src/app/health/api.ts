import express, {NextFunction, Request, Response} from "express";
import * as Server from "@/core/http/server";
import {StatusCode} from "@custom-types/core/server";
import NestedError from "nested-error-stacks";

const router = express.Router();

/**
 * Response: {success}
 * */
export const httpGetCheckHealth = async (_: Request, response: Response, next: NextFunction) => {
  try {
    response.status(StatusCode.OK).json({success: true});
  } catch (error: any) {
    next(new NestedError("failed health check", error));
  }
};
router.get("/check", httpGetCheckHealth);

export const addHttpEndPoints = () => {
  Server.bindApi("/health", router);
};
