import jsm from "../nats/JetStreamManager";

import {
  Flag,
  Segment,
  Attribute,
  Rule,
  sequelize,
} from "../models/flag.models";
import { formatSegment } from "../utils/segments.util";

export const getAllFlags = async (req, res) => {
  let flags;
  try {
    flags = await Flag.findAll({
      attributes: { exclude: ["id"] },
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  return res.status(200).json({ payload: flags });
};

export const getFlagById = async (req, res) => {
  const flagKey = req.params.fKey;
  let flag;
  try {
    flag = await Flag.findOne({
      where: { fKey: flagKey },
      attributes: { exclude: ["id"] },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (flag === null) {
    return res
      .status(404)
      .json({ error: `Flag with id ${flagKey} does not exist.` });
  }
  return res.status(200).json({ payload: flag });
};

export const createFlag = async (req, res) => {
  let flag;
  try {
    let newFlag = await Flag.create(
      { ...req.body },
      { fields: ["fKey", "title", "description"] },
    );
    flag = newFlag.get({ plain: true });
    delete flag.id;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  let msg = { type: "new-flag", payload: flag };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ payload: flag });
};

export const deleteFlag = async (req, res) => {
  const flagKey = req.params.fKey;
  let rowsImpacted;
  try {
    rowsImpacted = await Flag.destroy({
      where: {
        fKey: flagKey,
      },
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete flag." });
  }

  if (rowsImpacted === 0) {
    res.status(404).json({ error: `Flag with id ${flagKey} does not exist.` });
    return;
  }

  let msg = { type: "deleted-flag", payload: flagKey };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ message: "Flag successfully deleted." });
};

const updateFlagBody = async (req, res) => {
  const flagKey = req.params.fKey;

  let updatedFlag;
  try {
    let { title, description } = req.body.payload;
    updatedFlag = await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne(
        {
          where: { fKey: flagKey },
        },
        { transaction: t },
      );

      if (flag === null) {
        throw new Error(`Flag with id ${flagKey} does not exist.`);
      }

      flag.set({
        title,
        description,
      });

      await flag.save({ fields: ["title", "description"], transaction: t });
      return flag;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
  let planeFlag = updatedFlag.get({ plain: true });
  delete planeFlag.id;
  return res.status(200).json(planeFlag);
};

const toggleFlag = async (req, res) => {
  const flagKey = req.params.fKey;

  let updatedFlag;
  try {
    updatedFlag = await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne(
        {
          where: { fKey: flagKey },
        },
        { transaction: t },
      );

      if (flag === null) {
        throw new Error(`Flag with id ${flagKey} does not exist.`);
      }
      flag.set({ isActive: req.body.payload.isActive, updatedAt: new Date() });

      await flag.save({ fields: ["isActive", "updatedAt"], transaction: t });
      return flag;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
  let planeFlag = updatedFlag.get({ plain: true });
  delete planeFlag.id;
  delete planeFlag.title;
  delete planeFlag.description;

  res.status(200).json({ isActive: planeFlag.isActive });

  let msg = { type: "toggle", payload: updatedFlag };
  return jsm.publishFlagUpdate(msg);
};

const addSegmentToFlag = async (req, res) => {
  const flagKey = req.params.fKey;
  const segmentKey = req.body.payload.sKey;

  let updatedSegment, updatedFlag;
  try {
    [updatedSegment, updatedFlag] = await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne(
        {
          where: { fKey: flagKey },
          include: Segment,
        },
        { transaction: t },
      );

      if (flag === null) {
        throw new Error(`Flag with id ${flagKey} does not exist.`);
      }

      let segment = await Segment.findOne(
        {
          where: { sKey: segmentKey },
          include: {
            model: Rule,
            include: {
              model: Attribute,
            },
          },
        },
        { transaction: t },
      );

      if (segment === null) {
        return res
          .status(404)
          .json({ error: `Segment with id ${segmentKey} does not exist.` });
      }

      await flag.addSegment(segment, { transaction: t });

      await flag.set({ updatedAt: new Date() }, { transaction: t });

      await flag.save({ fields: ["updatedAt"], transaction: t });
      return [segment, flag];
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  let plainSegment = formatSegment(updatedSegment);
  let msg = {
    type: "segment add",
    payload: {
      fKey: updatedFlag.fKey,
      flagUpdatedA: updatedFlag.updatedAt,
      plainSegment,
    },
  };
  jsm.publishFlagUpdate(msg);

  res.status(200).json({ payload: plainSegment });
};

const removeSegmentFromFlag = async (req, res) => {
  const flagKey = req.params.fKey;
  const segmentKey = req.body.payload.sKey;

  try {
    await sequelize.transaction(async (t) => {
      let flag = await Flag.findOne(
        {
          where: { fKey: flagKey },
          include: Segment,
        },
        { transaction: t },
      );

      if (flag === null) {
        throw new Error(`Flag with id ${flagKey} does not exist.`);
      }

      let segment = await Segment.findOne(
        {
          where: { sKey: segmentKey },
        },
        { transaction: t },
      );

      if (segment === null) {
        return res
          .status(404)
          .json({ error: `Segment with id ${segmentKey} does not exist.` });
      }

      await flag.removeSegment(segment, { transaction: t });

      await flag.set({ updatedAt: new Date() }, { transaction: t });

      await flag.save({ fields: ["updatedAt"], transaction: t });
      return;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
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

export const updateFlag = async (req, res) => {
  let action = req.body.action;
  if (action === "body update") {
    updateFlagBody(req, res);
  } else if (action === "toggle") {
    toggleFlag(req, res);
  } else if (action === "segment add") {
    addSegmentToFlag(req, res);
  } else if (action === "segment remove") {
    removeSegmentFromFlag(req, res);
  }
};
