import { v4 as uuidv4 } from "uuid";
import jsm from "../nats/JetStreamManager";
import { formatSegments, formatSegment } from "../utils/segments.util";
import { Flag, Segment, Attribute, Rule } from "../models/flag.models";

import * as errorMsg from "../constants/error.messages";
import * as successMsg from "../constants/success.messages";
import HttpError from "../models/http-error";
import { parseError } from "../utils/error.util";

export const getAllSegments = async (req, res, next) => {
  let flagKey = req.query.fKey;
  let segments;
  try {
    if (flagKey) {
      let flag = await Flag.findOne({
        where: { fKey: flagKey },
        attributes: { exclude: ["id"] },
        include: [
          {
            model: Segment,
            attributes: { exclude: ["id"] },
            order: [["title", "DESC"]],
            include: {
              model: Rule,
              include: {
                model: Attribute,
              },
            },
          },
        ],
      });

      if (flag === null) {
        throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
      }
      let plainSegments = flag.get({ plain: true }).Segments;
      plainSegments.forEach((s) => {
        delete s.FlagSegments;
      });
      segments = plainSegments;
    } else {
      segments = await Segment.findAll({
        attributes: { exclude: ["id"] },
        order: [["title", "ASC"]],
        include: {
          model: Rule,
          include: {
            model: Attribute,
          },
        },
      });
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: formatSegments(segments) });
};

export const getSegmentByKey = async (req, res, next) => {
  const segmentKey = req.params.sKey;
  let segment;
  try {
    segment = await Segment.findOne({
      where: { sKey: segmentKey },
      attributes: { exclude: ["id"] },
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
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: formatSegment(segment) });
};

export const createSegment = async (req, res, next) => {
  let newSegment;
  try {
    newSegment = await Segment.create(
      { ...req.body },
      {
        fields: ["sKey", "title", "description", "rulesOperator"],
      }
    );
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: formatSegment(newSegment) });
};

export const deleteSegment = async (req, res, next) => {
  const segmentKey = req.params.sKey;

  try {
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
  } catch (error) {
    return next(parseError(error));
  }

  return res
    .status(200)
    .json({ message: successMsg.succDeletedItem("segment") });
};

const updateSegmentBody = async (req, res, next) => {
  const segmentKey = req.params.sKey;
  const { title, description, rulesOperator } = req.body.payload;
  let segment;
  try {
    segment = await Segment.findOne({
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
  } catch (error) {
    return next(parseError(error));
  }

  let plainSegment = segment.get({ plain: true });
  delete plainSegment.id;

  if (rulesOperator) {
    let msg = {
      type: "segment body update",
      payload: {
        sKey: plainSegment.sKey,
        rulesOperator: plainSegment.rulesOperator,
      },
    };
    jsm.publishFlagUpdate(msg);
  }
  return res.status(200).json(plainSegment);
};

const addRuleToSegment = async (req, res, next) => {
  const segmentKey = req.params.sKey;
  const attrKey = req.body.payload.aKey;

  let ruleInfo;
  try {
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
        ...req.body.payload,
        AttributeId: attr.id,
        SegmentId: segment.id,
        rKey: uuidv4(),
      },
      {
        fields: ["AttributeId", "SegmentId", "operator", "value", "rKey"],
      }
    );

    ruleInfo = {
      aKey: attr.aKey,
      rKey: rule.rKey,
      sKey: segment.sKey,
      type: attr.type,
      operator: rule.operator,
      value: rule.value,
    };
  } catch (error) {
    return next(parseError(error));
  }

  let msg = {
    type: "rule add",
    ruleInfo,
  };
  jsm.publishFlagUpdate(msg);
  res.status(200).json({ ruleInfo });
};

const updateRule = async (req, res, next) => {
  const segmentKey = req.params.sKey;
  const attrKey = req.body.payload.aKey;
  const ruleKey = req.body.payload.rKey;

  let ruleInfo;
  try {
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

    let rule = await Rule.findOne({
      where: { rKey: ruleKey },
    });
    if (rule === null) {
      throw new Error(`Rule with id ${ruleKey} does not exist.`);
    }

    const { operator, value, aKey, rKey } = req.body.payload;
    await rule.set({
      operator,
      value,
      aKey,
      rKey,
    });

    await rule.save({
      fields: ["operator", "value", "aKey", "rKey"],
    });
    ruleInfo = {
      rKey: rule.rKey,
      aKey: attr.aKey,
      operator: rule.operator,
      value: rule.value,
      type: attr.type,
      sKey: segment.sKey,
    };
  } catch (error) {
    console.log(error);
    return next(parseError(error));
  }
  let msg = {
    type: "rule update",
    payload: ruleInfo,
  };
  jsm.publishFlagUpdate(msg);
  return res.status(200).json({ payload: ruleInfo });
};

const removeRule = async (req, res, next) => {
  let ruleKey = req.body.payload.rKey;
  const segmentKey = req.params.sKey;

  try {
    let segment = await Segment.findOne({
      where: { sKey: segmentKey },
    });
    if (segment === null) {
      throw new HttpError(errorMsg.noSegmErrorMsg(segmentKey), 404);
    }
    let rowsImpacted = await Rule.destroy({
      where: {
        rKey: ruleKey,
        SegmentId: segment.id,
      },
    });
    if (rowsImpacted === 0) {
      throw new HttpError(errorMsg.noRuleErrorMsg(ruleKey), 404);
    }
  } catch (error) {
    return next(parseError(error));
  }

  let msg = {
    type: "rule remove",
    payload: { rKey: ruleKey, sKey: segmentKey },
  };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ message: successMsg.succDeletedItem("rule") });
};
export const updateSegment = async (req, res, next) => {
  let action = req.body.action;
  if (action === "body update") {
    updateSegmentBody(req, res, next);
  } else if (action === "rule add") {
    addRuleToSegment(req, res, next);
  } else if (action === "rule remove") {
    removeRule(req, res, next);
  } else if (action === "rule update") {
    updateRule(req, res, next);
  }
};
