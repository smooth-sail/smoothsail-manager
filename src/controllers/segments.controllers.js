import { v4 as uuidv4 } from "uuid";
import jsm from "../nats/JetStreamManager";
import { formatSegments, formatSegment } from "../utils/segments.util";
import {
  Flag,
  Segment,
  Attribute,
  Rule,
  sequelize,
} from "../models/flag.models";

export const getAllSegments = async (req, res) => {
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
            include: {
              model: Rule,
              include: {
                model: Attribute,
              },
            },
          },
        ],
      });

      // can this be done better?
      if (flag === null) {
        return res
          .status(404)
          .json({ error: `Flag with key ${flagKey} does not exist.` });
      }
      let plainSegments = flag.get({ plain: true }).Segments;
      plainSegments.forEach((s) => {
        delete s.FlagSegments;
      });
      segments = plainSegments;
    } else {
      segments = await Segment.findAll({
        attributes: { exclude: ["id"] },
        include: {
          model: Rule,
          include: {
            model: Attribute,
          },
        },
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  return res.status(200).json({ payload: formatSegments(segments) });
};

export const getSegmentByKey = async (req, res) => {
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
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (segment === null) {
    return res
      .status(404)
      .json({ error: `Segment with id ${segmentKey} does not exist.` });
  }
  return res.status(200).json({ payload: formatSegment(segment) });
};

export const createSegment = async (req, res) => {
  let newSegment;
  try {
    newSegment = await Segment.create(
      { ...req.body },
      {
        fields: ["sKey", "title", "description", "rulesOperator"],
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ payload: formatSegment(newSegment) });
};

export const deleteSegment = async (req, res) => {
  const segmentKey = req.params.sKey;
  let rowsImpacted;
  try {
    rowsImpacted = await sequelize.transaction(async (t) => {
      let segment = await Segment.findOne(
        {
          where: { sKey: segmentKey },
          include: "Flags",
        },
        { transaction: t }
      );

      if (segment === null) {
        throw new Error(`Segment with id ${segmentKey} does not exist.`);
      }

      if (segment.Flags && segment.Flags.length > 0) {
        return res.status(400).json({
          error: `Segment is referenced by at least one Flag. Remove it from a flag and try again.`,
        });
      }
      console.log(segment.Flag);

      rowsImpacted = await Segment.destroy(
        {
          where: {
            sKey: segmentKey,
          },
        },
        { transaction: t }
      );
      return rowsImpacted;
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal error occurred. Could not delete the segment.",
    });
  }

  if (rowsImpacted === 0) {
    return res
      .status(404)
      .json({ error: `Segment with id ${segmentKey} does not exist.` });
  }

  return res.status(200).json({ message: "Flag successfully deleted." });
};

const updateSegmentBody = async (req, res) => {
  const segmentKey = req.params.sKey;
  const { title, description, rulesOperator } = req.body.payload;
  let updatedSegment;
  try {
    updatedSegment = await sequelize.transaction(async (t) => {
      let segment = await Segment.findOne(
        {
          where: { sKey: segmentKey },
        },
        { transaction: t }
      );

      if (segment === null) {
        throw new Error(`Segment with id ${segmentKey} does not exist.`);
      }

      segment.set({
        title,
        description,
        rulesOperator,
      });
      // we can allow change of sKey if we want
      await segment.save({
        fields: ["title", "description", "rulesOperator"],
        transaction: t,
      });
      return segment;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  let plainSegment = updatedSegment.get({ plain: true });
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

const addRuleToSegment = async (req, res) => {
  const segmentKey = req.params.sKey;
  const attrKey = req.body.payload.aKey;

  let payload;
  try {
    let segment = await Segment.findOne({
      where: { sKey: segmentKey },
    });
    if (segment === null) {
      return res
        .status(404)
        .jsn({ error: `Segment with id ${segmentKey} does not exist.` });
    }

    let attr = await Attribute.findOne({
      where: { aKey: attrKey },
    });
    if (attr === null) {
      return res
        .status(404)
        .jsn({ error: `Attribute with id ${attrKey} does not exist.` });
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

    payload = {
      aKey: attr.aKey,
      rKey: rule.rKey,
      sKey: segment.sKey,
      type: attr.type,
      operator: rule.operator,
      value: rule.value,
    };
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal error occurred. Could not delete the segment.",
    });
  }

  let msg = {
    type: "rule add",
    payload,
  };
  jsm.publishFlagUpdate(msg);
  res.status(200).json({ payload });
};

const updateRule = async (req, res) => {
  const segmentKey = req.params.sKey;
  const attrKey = req.body.payload.aKey;
  const ruleKey = req.body.payload.rKey;
  let payload;
  try {
    payload = await sequelize.transaction(async (t) => {
      let segment = await Segment.findOne(
        {
          where: { sKey: segmentKey },
        },
        { transaction: t }
      );
      if (segment === null) {
        return res
          .status(404)
          .json({ error: `Segment with id ${segmentKey} does not exist.` });
      }

      let attr = await Attribute.findOne(
        {
          where: { aKey: attrKey },
        },
        { transaction: t }
      );
      if (attr === null) {
        return res
          .status(404)
          .json({ error: `Attribute with id ${attrKey} does not exist.` });
      }
      let rule = await Rule.findOne(
        {
          where: { rKey: ruleKey },
        },
        { transaction: t }
      );

      if (rule === null) {
        throw new Error(`Rule with id ${ruleKey} does not exist.`);
      }

      const { operator, value, aKey, rKey } = req.body.payload;
      await rule.set(
        {
          operator,
          value,
          aKey,
          rKey,
        },
        { transaction: t }
      );

      await rule.save({
        fields: ["operator", "value", "aKey", "rKey"],
        transaction: t,
      });
      return (payload = {
        rKey: rule.rKey,
        aKey: attr.aKey,
        operator: rule.operator,
        value: rule.value,
        type: attr.type,
        sKey: segment.sKey,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
  let msg = {
    type: "rule update",
    payload: payload,
  };
  jsm.publishFlagUpdate(msg);
  return res.status(200).json(payload);
};

const removeRule = async (req, res) => {
  let ruleKey = req.body.payload.rKey;
  const segmentKey = req.params.sKey;

  let rowsImpacted;
  try {
    let segment = await Segment.findOne({
      where: { sKey: segmentKey },
    });
    rowsImpacted = await Rule.destroy({
      where: {
        rKey: ruleKey,
        SegmentId: segment.id,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete the rule." });
  }

  if (rowsImpacted === 0) {
    return res
      .status(404)
      .json({ error: `Rule with id ${ruleKey} does not exist.` });
  }

  let msg = {
    type: "rule remove",
    payload: { rKey: ruleKey, sKey: segmentKey },
  };
  jsm.publishFlagUpdate(msg);

  return res.status(200).json({ message: "Rule successfully deleted." });
};
export const updateSegment = async (req, res) => {
  let action = req.body.action;
  if (action === "body update") {
    updateSegmentBody(req, res);
  } else if (action === "rule add") {
    addRuleToSegment(req, res);
  } else if (action === "rule remove") {
    removeRule(req, res);
  } else if (action === "rule update") {
    updateRule(req, res);
  }
};
