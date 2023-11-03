import { Segment, Attribute, Rule } from "../models/flag.models";
import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error";
import * as errorMsg from "../constants/error.messages";
import { formatSegment, formatSegments } from "../utils/segments.util";
import * as flagServices from "./flags.services";
import * as attrServices from "./attributes.services";

export const getAllSegments = async () => {
  const segments = await Segment.findAll({
    attributes: { exclude: ["id"] },
    order: [["title", "ASC"]],
    include: {
      model: Rule,
      include: {
        model: Attribute,
      },
    },
  });
  return formatSegments(segments);
};

export const getSegmentsOfFlag = async (flagKey) => {
  let flag = await flagServices.getFullFlagInfoById(flagKey);

  return formatSegments(flag.toJSON().Segments);
};

export const getSegmentByKey = async (segmentKey, format) => {
  let segment = await Segment.findOne({
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
  if (format) {
    segment = formatSegment(segment);
  }
  return segment;
};

export const createSegment = async ({
  sKey,
  title,
  description,
  rulesOperator,
}) => {
  const segment = await Segment.create(
    { sKey, title, description, rulesOperator },
    {
      fields: ["sKey", "title", "description", "rulesOperator"],
    }
  );
  return formatSegment(segment);
};

export const deleteSegment = async (segmentKey) => {
  let segment = await Segment.findOne({
    where: { sKey: segmentKey },
    include: "Flags",
  });

  if (segment === null) {
    throw new HttpError(errorMsg.noSegmErrorMsg(segmentKey), 404);
  }

  if (segment.Flags && segment.Flags.length > 0) {
    throw new HttpError(
      errorMsg.segmRefFlagErr(
        segmentKey,
        segment.Flags.map((f) => f.fKey)
      ),
      409
    );
  }

  await Segment.destroy({
    where: {
      sKey: segmentKey,
    },
  });
};

export const updateSegmentBody = async ({
  segmentKey,
  title,
  description,
  rulesOperator,
}) => {
  let segment = await Segment.findOne({
    where: { sKey: segmentKey },
  });

  if (segment === null) {
    throw new Error(`Segment with id ${segmentKey} does not exist.`);
  }

  segment.set({
    title,
    description,
    rulesOperator,
  });

  await segment.save({
    fields: ["title", "description", "rulesOperator"],
  });
  segment = segment.toJSON();
  delete segment.id;
  return segment;
};

export const addRule = async ({ segmentKey, attrKey, operator, value }) => {
  let segment = await Segment.findOne({
    where: { sKey: segmentKey },
  });
  if (segment === null) {
    throw new HttpError(errorMsg.noSegmErrorMsg(segmentKey), 404);
  }

  let attr = await Attribute.findOne({
    where: { aKey: attrKey },
  });
  if (attr === null) {
    throw new HttpError(errorMsg.noAttrErrorMsg(attrKey), 404);
  }

  let rule = await Rule.create(
    {
      operator,
      value,
      AttributeId: attr.id,
      SegmentId: segment.id,
      rKey: uuidv4(),
    },
    {
      fields: ["AttributeId", "SegmentId", "operator", "value", "rKey"],
    }
  );

  return {
    aKey: attr.aKey,
    rKey: rule.rKey,
    sKey: segment.sKey,
    type: attr.type,
    operator: rule.operator,
    value: rule.value,
  };
};

export const updateRule = async ({ sKey, aKey, rKey, operator, value }) => {
  let segment = await getSegmentByKey(sKey);
  let attr = await attrServices.getAttributeByKey(aKey);

  let rule = await Rule.findOne({
    where: { rKey },
  });

  if (rule === null) {
    throw new Error(`Rule with id ${rKey} does not exist.`);
  }

  await rule.set({
    operator,
    value,
    AttributeId: attr.id,
    rKey,
  });

  await rule.save({
    fields: ["operator", "value", "AttributeId", "rKey"],
  });

  return {
    rKey: rule.rKey,
    aKey: attr.aKey,
    operator: rule.operator,
    value: rule.value,
    type: attr.type,
    sKey: segment.sKey,
  };
};

export const removeRule = async (segmentKey, ruleKey) => {
  let segment = await getSegmentByKey(segmentKey);

  let rowsImpacted = await Rule.destroy({
    where: {
      rKey: ruleKey,
      SegmentId: segment.id,
    },
  });
  if (rowsImpacted === 0) {
    throw new HttpError(errorMsg.noRuleErrorMsg(ruleKey), 404);
  }
};
