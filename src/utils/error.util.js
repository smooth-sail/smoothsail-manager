import HttpError from "../models/http-error";
import { ValidationError } from "sequelize";
import * as errorMsg from "../constants/error.messages";

export const parseError = (error) => {
  // console.log(error.message); // replace with logger

  if (error instanceof ValidationError) {
    return new HttpError(errorMsg.VALIDATION, 400);
  } else if (error instanceof HttpError) {
    return error;
  }

  return new HttpError(errorMsg.INTERNAL, 500);
};
