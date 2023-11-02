import jsm from "../nats/JetStreamManager";

import {
  Flag,
  Segment,
  Attribute,
  Rule,
  sequelize,
} from "../models/flag.models";
import { formatSegment } from "../utils/segments.util";
import { updatedATFlagColManualSetQuery } from "../constants/db.manual.queries";
import * as errorMsg from "../constants/error.messages";
import HttpError from "../models/http-error";
import { parseError } from "../utils/error.util";

export const getAllFlags = async (req, res, next) => {
  let flags;
  try {
    flags = await Flag.findAll({
      attributes: { exclude: ["id"] },
      order: [["updatedAt", "DESC"]],
    });
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flags });
};

export const getFlagById = async (req, res, next) => {
  const flagKey = req.params.fKey;
  let flag;
  try {
    flag = await Flag.findOne({
      where: { fKey: flagKey },
      attributes: { exclude: ["id"] },
    });
    if (flag === null) {
      throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
    }
  } catch (error) {
    return next(parseError(error));
  }

  return res.status(200).json({ payload: flag });
};

export const createFlag = async (req, res, next) => {
  let flag;
  try {
    let newFlag = await Flag.create(
      { ...req.body },
      { fields: ["fKey", "title", "description"] }
    );
    flag = newFlag.get({ plain: true });
    delete flag.id;
  } catch (error) {
    return next(parseError(error));
  }

  let msg = { type: "new-flag", payload: flag };
  jsm.publishFlagUpdate(msg);

  return res.status(201).json({ payload: flag });
};

export const deleteFlag = async (req, res, next) => {
  const flagKey = req.params.fKey;
  let rowsImpacted;
  try {
    rowsImpacted = await Flag.destroy({
      where: {
        fKey: flagKey,
      },
    });
    if (rowsImpacted === 0) {
      throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
    }
  } catch (error) {
    return next(parseError(error));
  }

  let msg = { type: "deleted-flag", payload: flagKey };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ message: "Flag successfully deleted." });
};

const updateFlagBody = async (req, res, next) => {
  const flagKey = req.params.fKey;
  let { title, description } = req.body.payload;
  let flag;
  try {
    flag = await Flag.findOne({
      where: { fKey: flagKey },
    });

    if (flag === null) {
      throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
    }

    flag.set({ title, description });

    await flag.save({ fields: ["title", "description"] });
  } catch (error) {
    return next(parseError(error));
  }

  let planeFlag = flag.get({ plain: true });
  delete planeFlag.id;
  return res.status(200).json(planeFlag);
};

const toggleFlag = async (req, res, next) => {
  const flagKey = req.params.fKey;

  let updatedFlag;
  try {
    let flag = await Flag.findOne({ where: { fKey: flagKey } });

    if (flag === null) {
      throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
    }
    flag.set({ isActive: req.body.payload.isActive });

    await flag.save({ fields: ["isActive"] });
  } catch (error) {
    return next(parseError(error));
  }
  let planeFlag = updatedFlag.get({ plain: true });
  delete planeFlag.id;
  delete planeFlag.title;
  delete planeFlag.description;

  let msg = { type: "toggle", payload: updatedFlag };
  jsm.publishFlagUpdate(msg);

  res.status(200).json({ isActive: planeFlag.isActive });
};

const addSegmentToFlag = async (req, res, next) => {
  const flagKey = req.params.fKey;
  const segmentKey = req.body.payload.sKey;

  let updatedSegment, updatedFlag;
  try {
    [updatedSegment, updatedFlag] = await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne({
        where: { fKey: flagKey },
        include: Segment,
      });

      if (flag === null) {
        throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
      }

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
        throw new HttpError(errorMsg.noSegmErrorMsg(flagKey), 404);
      }

      await flag.addSegment(segment, { transaction: t });

      await sequelize.query(updatedATFlagColManualSetQuery(flag.id), {
        transaction: t,
      });

      return [segment, flag];
    });
  } catch (error) {
    return next(parseError(error));
  }

  let plainSegment = formatSegment(updatedSegment);
  let msg = {
    type: "segment add",
    payload: {
      fKey: updatedFlag.fKey,
      // flagUpdatedAt: updatedFlag.updatedAt,
      plainSegment,
    },
  };
  jsm.publishFlagUpdate(msg);

  res.status(200).json({ payload: plainSegment });
};

const removeSegmentFromFlag = async (req, res, next) => {
  const flagKey = req.params.fKey;
  const segmentKey = req.body.payload.sKey;

  try {
    await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne({
        where: { fKey: flagKey },
        include: Segment,
      });

      if (flag === null) {
        throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
      }

      let segment = await Segment.findOne({
        where: { sKey: segmentKey },
      });

      if (segment === null) {
        throw new HttpError(errorMsg.noSegmErrorMsg(flagKey), 404);
      }

      await flag.removeSegment(segment, { transaction: t });

      await sequelize.query(updatedATFlagColManualSetQuery(flag.id), {
        transaction: t,
      });
      return;
    });
  } catch (error) {
    return next(parseError(error));
  }

  let msg = {
    type: "segment remove",
    payload: {
      fKey: flagKey,
      sKey: segmentKey,
    },
  };
  jsm.publishFlagUpdate(msg);

  res.status(200).json({ message: "Segment was successfully removed." });
};

export const updateFlag = async (req, res, next) => {
  let action = req.body.action;
  if (action === "body update") {
    updateFlagBody(req, res, next);
  } else if (action === "toggle") {
    toggleFlag(req, res, next);
  } else if (action === "segment add") {
    addSegmentToFlag(req, res, next);
  } else if (action === "segment remove") {
    removeSegmentFromFlag(req, res, next);
  }
};
