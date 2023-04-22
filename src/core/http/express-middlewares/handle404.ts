import {Request, Response} from "express";
import {StatusCode} from "@custom-types/core";

export default (_: Request, response: Response) => {
  response.status(StatusCode.RESOURCE_NOT_FOUND).json({code: StatusCode.RESOURCE_NOT_FOUND, error: "not found"});
}
