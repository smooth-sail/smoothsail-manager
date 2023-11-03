import {
  Flag,
  Segment,
  Rule,
  Attribute,
  sequelize,
} from "../models/flag.models";
import HttpError from "../models/http-error";
import * as errorMsg from "../constants/error.messages";
import { updatedATFlagColManualSetQuery } from "../constants/db.manual.queries";
import { formatSegment } from "../utils/segments.util";
import * as segmServices from "./segments.services";

export const getAllFlags = async () => {
  const flags = await Flag.findAll({
    attributes: { exclude: ["id"] },
    order: [["updatedAt", "DESC"]],
  });
  return flags;
};

export const getFlagByKey = async (flagKey, format) => {
  let flag = await Flag.findOne({
    where: { fKey: flagKey },
  });
  if (flag === null) {
    throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
  }
  if (format === true) {
    flag = flag.toJSON();
    delete flag.id;
  }
  return flag;
};

export const getFullFlagInfoById = async (flagKey) => {
  const flag = await Flag.findOne({
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
  return flag;
};

export const createFlag = async ({ fKey, title, description }) => {
  const newFlag = await Flag.create(
    { fKey, title, description },
    { fields: ["fKey", "title", "description"] }
  );
  const flag = newFlag.get({ plain: true });
  delete flag.id;

  return flag;
};

export const deleteFlag = async (flagKey) => {
  let rowsImpacted = await Flag.destroy({
    where: {
      fKey: flagKey,
    },
  });
  if (rowsImpacted === 0) {
    throw new HttpError(errorMsg.noFlagErrorMsg(flagKey), 404);
  }
};

export const updateFlagBody = async (flagKey, title, description) => {
  const flag = await getFlagByKey(flagKey);

  flag.set({ title, description });
  await flag.save({ fields: ["title", "description"] });

  let planeFlag = flag.toJSON();
  delete planeFlag.id;

  return planeFlag;
};

export const toggle = async (flagKey, isActive) => {
  const flag = await getFlagByKey(flagKey);

  flag.set({ isActive });

  await flag.save({ fields: ["isActive"] });
  let planeFlag = flag.toJSON();
  delete planeFlag.id;
  delete planeFlag.title;
  delete planeFlag.description;

  return planeFlag;
};

export const addSegmentToFlag = async (flagKey, segmentKey) => {
  const flag = await getFlagByKey(flagKey);
  const segment = await segmServices.getSegmentByKey(segmentKey);

  await sequelize.transaction(async (t) => {
    await flag.addSegment(segment, { transaction: t });

    await sequelize.query(updatedATFlagColManualSetQuery(flag.id), {
      transaction: t,
    });
  });

  return formatSegment(segment);
};

export const removeSegmentFromFlag = async (flagKey, segmentKey) => {
  const flag = await getFlagByKey(flagKey);
  const segment = await segmServices.getSegmentByKey(segmentKey);

  await sequelize.transaction(async (t) => {
    await flag.removeSegment(segment, { transaction: t });

    await sequelize.query(updatedATFlagColManualSetQuery(flag.id), {
      transaction: t,
    });
  });
};
