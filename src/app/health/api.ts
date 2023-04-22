import express, {Request, Response} from "express";
import * as Server from "@/core/http/server";
import {StatusCode} from "@custom-types/core/server";

const router = express.Router();

/**
 * Response: {success}
 * */
export const httpGetCheckHealth = async (_: Request, response: Response) => {
  try {
    response.status(StatusCode.OK).json({success: true});
  } catch (error: any) {
    response.status(StatusCode.BAD_REQUEST).json({success: false});
  }
};
router.get("/check", httpGetCheckHealth);

export const addHttpEndPoints = () => {
  Server.bindApi("/health", router);
};
