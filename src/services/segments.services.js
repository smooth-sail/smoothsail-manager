import {
  Flag,
  Segment,
  Attribute,
  Rule,
  sequelize,
} from "../models/flag.models";
import HttpError from "../models/http-error";
import * as errorMsg from "../constants/error.messages";
import * as successMsg from "../constants/success.messages";
import { formatSegment } from "../utils/segments.util";

export const getSegmentById = async (segmentKey) => {
  const segment = await Segment.findOne({
    where: { sKey: segmentKey },
    include: {
      model: Rule,
      include: {
        model: Attribute,
      },
    },
  });

  if (segment === null) {
    throw new HttpError(errorMsg.noSegmErrorMsg(segmentKey), 404);
  }
  return segment;
};
