import jsm from "../nats/JetStreamManager";
import * as flagServices from "../services/flags.services";
import * as successMsg from "../constants/success.messages";
import { parseError } from "../utils/error.util";
import HttpError from "../models/http-error";
import { UNSUPPORTED_ACTION } from "../constants/error.messages";

export const getAllFlags = async (req, res, next) => {
  let flags;
  try {
    flags = await flagServices.getAllFlags();
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flags });
};

export const getFlagByKey = async (req, res, next) => {
  let flag;
  try {
    flag = await flagServices.getFlagByKey(req.params.fKey, true);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flag });
};

export const createFlag = async (req, res, next) => {
  let flag;
  try {
    flag = await flagServices.createFlag(req.body);
    let msg = { type: "new-flag", payload: flag };
    jsm.publishFlagUpdate(msg);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(201).json({ payload: flag });
};

export const deleteFlag = async (req, res, next) => {
  let flagKey = req.params.fKey;
  try {
    await flagServices.deleteFlag(flagKey);
    let msg = { type: "deleted-flag", payload: flagKey };
    jsm.publishFlagUpdate(msg);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ message: successMsg.succDeletedItem("flag") });
};

export const updateFlag = async (req, res, next) => {
  let action = req.body.action;
  let fKey = req.params.fKey;

  let payload;
  try {
    let msg;
    if (action === "body update") {
      const { title, description } = req.body.payload;
      payload = await flagServices.updateFlagBody(fKey, title, description);
    } else if (action === "toggle") {
      let flag = await flagServices.toggle(fKey, req.body.payload.isActive);

      payload = { isActive: flag.isActive };
      msg = { type: "toggle", payload: flag };
    } else if (action === "segment add") {
      payload = await flagServices.addSegmentToFlag(
        fKey,
        req.body.payload.sKey
      );

      msg = {
        type: "segment add",
        payload: {
          fKey,
          plainSegment: payload,
        },
      };
    } else if (action === "segment remove") {
      const segmentKey = req.body.payload.sKey;
      await flagServices.removeSegmentFromFlag(fKey, segmentKey);

      payload = successMsg.succDeletedItem("segment");
      msg = {
        type: "segment remove",
        payload: {
          fKey,
          sKey: segmentKey,
        },
      };
    } else {
      throw new HttpError(UNSUPPORTED_ACTION, 400);
    }

    if (msg) {
      jsm.publishFlagUpdate(msg);
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload });
};
