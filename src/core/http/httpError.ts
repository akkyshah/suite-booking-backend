import NestedError from "nested-error-stacks";

export class HttpError extends NestedError {
  public status: number;
  public errCode: string;

  constructor(status: number, errCode: string, errorMessage: string, error?: NestedError | Error) {
    super(errorMessage, error);
    this.status = status;
    this.errCode = errCode;
  }

  static isHttpError(err: any): err is HttpError {
    return typeof err === "object" && err?.errCode;
  }
}
