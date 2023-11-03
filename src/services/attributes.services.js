import { Segment, Attribute, Rule } from "../models/flag.models";
import HttpError from "../models/http-error";
import * as errorMsg from "../constants/error.messages";

export const getAttributeByKey = async (aKey) => {
  let attr = await Attribute.findOne({
    where: { aKey: aKey },
  });

  if (attr === null) {
    throw new HttpError(errorMsg.noAttrErrorMsg(aKey), 404);
  }
  return attr;
};
