import winstonLogger from "../config/logger";
import HttpError from "../models/http-error";
import { ValidationError, UniqueConstraintError } from "sequelize";
import * as errorMsg from "../constants/error.messages";

export const parseError = (error) => {
  if (error instanceof UniqueConstraintError) {
    return new HttpError(errorMsg.DUPLICATE_ENTRY, 409);
  } else if (error instanceof ValidationError) {
    return new HttpError(errorMsg.VALIDATION, 400);
  } else if (error instanceof HttpError) {
    return error;
  }
  winstonLogger.error(`An error occured: ${error.message}`);
  return new HttpError(errorMsg.INTERNAL, 500);
};
