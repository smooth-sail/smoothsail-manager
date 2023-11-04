import HttpError from "../models/http-error";
import { ValidationError, UniqueConstraintError } from "sequelize";
import * as errorMsg from "../constants/error.messages";

export const parseError = (error) => {
  console.log(error.message); // replace with logger

  if (error instanceof UniqueConstraintError) {
    return new HttpError(errorMsg.DUPLICATE_ENTRY, 409);
  } else if (error instanceof ValidationError) {
    return new HttpError(errorMsg.VALIDATION, 400);
  } else if (error instanceof HttpError) {
    return error;
  }

  return new HttpError(errorMsg.INTERNAL, 500);
};
