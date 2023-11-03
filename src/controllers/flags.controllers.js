import jsm from "../nats/JetStreamManager";
import * as flagServices from "../services/flags.services";
import * as successMsg from "../constants/success.messages";
import { parseError } from "../utils/error.util";

export const getAllFlags = async (req, res, next) => {
  let flags;
  try {
    flags = await flagServices.getAllFlags();
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flags });
};

export const getFlagById = async (req, res, next) => {
  let flag;
  try {
    flag = await flagServices.getFlagById(req.params.fKey, true);
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flag });
};

export const createFlag = async (req, res, next) => {
  let flag;
  try {
    flag = await flagServices.createFlag(req.body);
  } catch (error) {
    return next(parseError(error));
  }

  let msg = { type: "new-flag", payload: flag };
  jsm.publishFlagUpdate(msg);

  return res.status(201).json({ payload: flag });
};

export const deleteFlag = async (req, res, next) => {
  let flagKey = req.params.fKey;
  try {
    await flagServices.deleteFlag(flagKey);
  } catch (error) {
    return next(parseError(error));
  }

  let msg = { type: "deleted-flag", payload: flagKey };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ message: successMsg.succDeletedItem("flag") });
};

export const updateFlag = async (req, res, next) => {
  let action = req.body.action;

  let payload;
  let msg;
  try {
    if (action === "body update") {
      const { title, description } = req.body.payload;
      payload = await flagServices.updateFlagBody(
        req.params.fKey,
        title,
        description
      );
    } else if (action === "toggle") {
      let flag = await flagServices.toggle(
        req.params.fKey,
        req.body.payload.isActive
      );
      payload = { isActive: flag.isActive };
      msg = { type: "toggle", payload: flag };
    } else if (action === "segment add") {
      payload = await flagServices.addSegmentToFlag(
        req.params.fKey,
        req.body.payload.sKey
      );

      msg = {
        type: "segment add",
        payload: {
          fKey: req.params.fKey,
          plainSegment: payload,
        },
      };
    } else if (action === "segment remove") {
      const flagKey = req.params.fKey;
      const segmentKey = req.body.payload.sKey;
      await flagServices.removeSegmentFromFlag(flagKey, segmentKey);
      msg = {
        type: "segment remove",
        payload: {
          fKey: flagKey,
          sKey: segmentKey,
        },
      };
      payload = successMsg.succDeletedItem("segment");
    }
  } catch (error) {
    return next(parseError(error));
  }

  if (msg) {
    jsm.publishFlagUpdate(msg);
  }

  return res.status(200).json({ payload });
};
