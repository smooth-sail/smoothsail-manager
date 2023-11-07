import jsm from "../nats/JetStreamManager";

import * as segmServices from "../services/segments.services";
import * as successMsg from "../constants/success.messages";
import { parseError } from "../utils/error.util";
import HttpError from "../models/http-error";
import { UNSUPPORTED_ACTION } from "../constants/error.messages";

export const getAllSegments = async (req, res, next) => {
  let flagKey = req.query.fKey;
  let segments;
  try {
    if (flagKey) {
      segments = await segmServices.getSegmentsOfFlag(flagKey);
    } else {
      segments = await segmServices.getAllSegments();
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: segments });
};

export const getSegmentByKey = async (req, res, next) => {
  const segmentKey = req.params.sKey;
  let segment;
  try {
    segment = await segmServices.getSegmentByKey(segmentKey, true);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: segment });
};

export const createSegment = async (req, res, next) => {
  let segment;
  try {
    segment = await segmServices.createSegment(req.body);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: segment });
};

export const deleteSegment = async (req, res, next) => {
  const segmentKey = req.params.sKey;

  try {
    await segmServices.deleteSegment(segmentKey);
  } catch (error) {
    return next(parseError(error));
  }

  return res
    .status(200)
    .json({ message: successMsg.succDeletedItem("segment") });
};

export const updateSegment = async (req, res, next) => {
  let action = req.body.action;

  let payload;
  try {
    let msg;
    if (action === "body update") {
      const segment = await segmServices.updateSegmentBody({
        segmentKey: req.params.sKey,
        ...req.body.payload,
      });
      msg = {
        type: "segment body update",
        payload: {
          sKey: segment.sKey,
          rulesOperator: segment.rulesOperator,
        },
      };

      payload = segment;
    } else if (action === "rule add") {
      const ruleInfo = await segmServices.addRule({
        segmentKey: req.params.sKey,
        attrKey: req.body.payload.aKey,
        ...req.body.payload,
      });

      msg = {
        type: "rule add",
        payload: ruleInfo,
      };

      payload = { ruleInfo };
    } else if (action === "rule remove") {
      const sKey = req.params.sKey;
      const rKey = req.body.payload.rKey;
      await segmServices.removeRule(sKey, rKey);
      msg = {
        type: "rule remove",
        payload: { rKey, sKey },
      };
    } else if (action === "rule update") {
      const ruleInfo = await segmServices.updateRule({
        sKey: req.params.sKey,
        ...req.body.payload,
      });
      msg = {
        type: "rule update",
        payload: ruleInfo,
      };
      payload = { payload: ruleInfo };
    } else {
      throw new HttpError(UNSUPPORTED_ACTION, 400);
    }
    jsm.publishFlagUpdate(msg);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json(payload);
};
