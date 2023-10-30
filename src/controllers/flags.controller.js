import { v4 as uuidv4 } from "uuid";
// import Clients from "../models/sse-clients";
import { Flag, Segment, Attribute, Rule, sequelize } from "../models/sequelize";
import jsm from "../nats/JetStreamManager";

// sse related instances
// let clients = new Clients();

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
      { fields: ["fKey", "title", "description"] }
    );
    flag = newFlag.get({ plain: true });
    delete flag.id;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes
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
        { transaction: t }
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
        { transaction: t }
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
  let planeFlag = updatedFlag.get({ plain: true }); // repetition, can be extracted into method
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
        { transaction: t }
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
        { transaction: t }
      );

      if (segment === null) {
        return res
          .status(404)
          .json({ error: `Segment with id ${segmentKey} does not exist.` });
      }

      await flag.addSegment(segment, { transaction: t });

      await flag.set({ updatedAt: new Date() }, { transaction: t }); // updating updatedAt - need checking

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
        { transaction: t }
      );

      if (flag === null) {
        throw new Error(`Flag with id ${flagKey} does not exist.`);
      }

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

// ================== SEGMENTS
const formatSegment = (s, forSDK) => {
  if (typeof s.get === "function") {
    s = s.get({ plain: true });
  }
  delete s.id;
  delete s.FlagSegments;

  if (forSDK) {
    delete s.title;
    delete s.description;
  }
  if (s.Rules) {
    let rules = s.Rules;
    delete s.Rules;
    s.rules = rules.map((r) => {
      if (typeof r.get === "function") {
        r = r.get({ plain: true });
      }

      r.aKey = r.Attribute.aKey;
      r.type = r.Attribute.type;
      delete r.Attribute;
      delete r.id;
      delete r.AttributeId;
      delete r.SegmentId;
      return r;
    });
  } else {
    s.rules = [];
  }

  return s;
};
export const formatSegments = (segments, forSDK) => {
  return segments.map((s) => {
    return formatSegment(s, forSDK);
  });
};

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
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
  }

  let plainSegment = updatedSegment.get({ plain: true }); // DRY into sep method
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

// =================== Attributes
export const getAllAttributes = async (req, res) => {
  let attr;
  try {
    attr = await Attribute.findAll({
      attributes: { exclude: ["id"] },
      order: [["aKey", "ASC"]],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }
  return res.status(200).json({ payload: attr });
};

export const getAttributeByKey = async (req, res) => {
  const attrKey = req.params.aKey;
  let attr;
  try {
    attr = await Attribute.findOne({
      where: { aKey: attrKey },
      attributes: { exclude: ["id"] },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (attr === null) {
    return res
      .status(404)
      .json({ error: `Attribute with id ${attrKey} does not exist.` });
  }
  return res.status(200).json({ payload: attr });
};

export const createAttribute = async (req, res) => {
  let attr;
  try {
    let newAttr = await Attribute.create(
      { ...req.body },
      { fields: ["aKey", "name", "type"] }
    );
    attr = newAttr.get({ plain: true });
    delete attr.id;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal error occurred." });
  }

  return res.status(200).json({ payload: attr });
};

export const deleteAttribute = async (req, res) => {
  const attrKey = req.params.aKey;
  let rowsImpacted;
  try {
    rowsImpacted = await Attribute.destroy({
      where: {
        aKey: attrKey,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal error occurred. Could not delete the attribute.",
    });
  }

  if (rowsImpacted === 0) {
    res
      .status(404)
      .json({ error: `Attribute with id ${attrKey} does not exist.` });
    return;
  }

  return res.status(200).json({ message: "Attribute successfully deleted." });
};

export const updateAttribute = async (req, res) => {
  const attrKey = req.params.aKey;

  let updatedAttr;
  try {
    updatedAttr = await sequelize.transaction(async (t) => {
      let attr = await Attribute.findOne(
        {
          where: { aKey: attrKey },
        },
        { transaction: t }
      );

      if (attr === null) {
        throw new Error(`Attribute with id ${attrKey} does not exist.`);
      }

      attr.set({ aKey: req.body.aKey, name: req.body.name });
      await attr.save();
      return attr;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }

  let plainAttr = updatedAttr.toJSON();
  delete plainAttr.id;
  return res.status(200).json({ payload: plainAttr });
};

// =================== SDK-service routes

export const getSdkFlags = async (req, res) => {
  let data = {};
  try {
    let flags = await Flag.findAll({
      attributes: { exclude: ["id", "title", "description", "createdAt"] },
      include: {
        model: Segment,
        include: {
          model: Rule,
          include: {
            model: Attribute,
          },
        },
      },
    });
    flags.forEach((f) => {
      f = f.toJSON();
      f.segments = formatSegments(f.Segments, true);
      delete f.Segments;
      data[f.fKey] = f;
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal error occurred." });
  }
  res.status(200).json({ payload: data });
};
