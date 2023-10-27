import Clients from "../models/sse-clients";

// sequelize imports
import {
  Flag,
  Segment,
  Attribute,
  Rule,
  sequelize,
} from "../tmp_orm_files/sequelize";

// sse related instances
let clients = new Clients();

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
      // include: Segment,
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

  let sseMsg = { type: "new-flag", payload: flag };
  clients.sendNotificationToAllClients(sseMsg);

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

  let sseMsg = { type: "deleted-flag", payload: flagKey };
  clients.sendNotificationToAllClients(sseMsg);

  return res.status(200).json({ message: "Flag successfully deleted." });
};

const updateFlagBody = async (req, res) => {
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

      flag.set({ ...req.body.payload });

      await flag.save({ fields: ["title", "description"], transaction: t });
      return flag;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
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

      flag.set({ ...req.body.payload, updatedAt: new Date() });

      await flag.save({ fields: ["isActive", "updatedAt"], transaction: t });
      return flag;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
  }
  let planeFlag = updatedFlag.get({ plain: true }); // repetition, can be extracted into method
  delete planeFlag.id;
  delete planeFlag.title;
  delete planeFlag.description;

  res.status(200).json({ isActive: planeFlag.isActive });

  let sseMsg = { type: "toggle", payload: updatedFlag };
  return clients.sendNotificationToAllClients(sseMsg);
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
        // will need to include rules for SDK
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

      flag.addSegment(segment, { transaction: t });

      flag.set({ updatedAt: new Date() }, { transaction: t }); // updating updatedAt - need checking

      await flag.save({ fields: ["updatedAt"], transaction: t });
      return [segment, flag];
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
  }
  let plainSegment = updatedSegment.get({ plain: true }); // repetition, can be extracted into method
  delete plainSegment.id;

  let sseMsg = {
    type: "segment add",
    payload: {
      fKey: updatedFlag.fKey,
      flagUpdatedA: updatedFlag.updatedAt,
      plainSegment,
    },
  };
  clients.sendNotificationToAllClients(sseMsg);

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

      flag.removeSegment(segment, { transaction: t });

      flag.set({ updatedAt: new Date() }, { transaction: t }); // updating updatedAt - need checking

      await flag.save({ fields: ["updatedAt"], transaction: t });
      return;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
  }

  let sseMsg = {
    type: "segment remove",
    payload: {
      fKey: flagKey,
      sKey: segmentKey,
    },
  };
  clients.sendNotificationToAllClients(sseMsg);

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
const formatSegments = (segments, forSDK) => {
  return segments.map((s) => {
    return formatSegment(s, forSDK);
  });
};

export const getAllSegments = async (req, res) => {
  // should attach rules to segments
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

  segments = formatSegments(segments);

  return res.status(200).json({ payload: segments });
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
  let formatedSegment = formatSegment(segment); // refactor!
  return res.status(200).json({ payload: formatedSegment });
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
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes
  }

  let segment = formatSegment(newSegment);
  return res.status(200).json({ payload: segment });
};

export const deleteSegment = async (req, res) => {
  const segmentKey = req.params.sKey;
  let rowsImpacted;
  try {
    // should not be able to remove a segment if it is attached to a flag (x)
    // OR you shold be able to, but then you'll need to notify SDK about this change
    rowsImpacted = await Segment.destroy({
      where: {
        sKey: segmentKey,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal error occurred. Could not delete the segment.",
    });
  }

  if (rowsImpacted === 0) {
    res
      .status(404)
      .json({ error: `Segment with id ${segmentKey} does not exist.` });
    return;
  }

  return res.status(200).json({ message: "Flag successfully deleted." });
};

const updateSegmentBody = async (req, res) => {
  const segmentKey = req.params.sKey;

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

      segment.set({ ...req.body.payload });
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

  if (req.body.payload.rulesOperator) {
    let sseMsg = {
      type: "segment body update",
      payload: {
        sKey: plainSegment.sKey,
        rulesOperator: plainSegment.rulesOperator,
      },
    };
    clients.sendNotificationToAllClients(sseMsg);
  }
  return res.status(200).json(plainSegment);
};

export const updateSegment = async (req, res) => {
  let action = req.body.action;
  if (action === "body update") {
    updateSegmentBody(req, res);
  } else if (action === "rule add") {
    // add rule
  } else if (action === "rule remove") {
    // remove rule
  } else if (action === "rule update") {
    // rule update
  }

  //   } else if (req.body.action === "rule add") {
  //     let attribute = await pgA.getAttribute(req.body.payload.a_key);
  //     // if no attribute - return 404;

  //     let ruleSet = {
  //       r_key: generateRandomString(),
  //       operator: req.body.payload.operator,
  //       value: req.body.payload.value,
  //       segments_id: segmentId,
  //       attributes_id: attribute.id,
  //     };
  //     let newRule = await pgS.addRule(ruleSet);
  //     delete newRule.id;
  //     delete newRule.segments_id;
  //     delete newRule.attributes_id;
  //     newRule.a_key = req.body.payload.a_key;
  //     newRule.s_key = segmentKey;
  //     // sse notification
  //     sseMsg = {
  //       type: "rule add",
  //       payload: newRule,
  //     };
  //     res.status(200).json({ payload: newRule });
  //
  //
  //   } else if (req.body.action === "rule remove") {
  //     let r_key = req.body.payload.r_key;
  //     let removedRule = await pgS.removeRule(r_key, segmentKey);
  //     if (!removedRule) {
  //       res
  //         .status(404)
  //         .json({ error: `Rule with key '${r_key}' does not exist.` });
  //       return;
  //     }
  //     // sse notification
  //     sseMsg = {
  //       type: "rule remove",
  //       payload: { r_key, s_key: segmentKey },
  //     };
  //     res.status(200).json({ message: "Rule successfully deleted." });
  //
  //
  //   } else if (req.body.action === "rule update") {
  //     let attribute = await pgA.getAttribute(req.body.payload.a_key);
  //     console.log(attribute);
  //     // if no attribute - return 404;
  //     let ruleSet = {
  //       operator: req.body.payload.operator,
  //       value: req.body.payload.value,
  //       a_key: attribute.id,
  //       r_key: req.body.payload.r_key,
  //     };
  //     let newRule = await pgS.updateRule(ruleSet);
  //     delete newRule.id;
  //     delete newRule.segments_id;
  //     delete newRule.attributes_id;
  //     newRule.a_key = attribute.a_key;
  //     newRule.s_key = segmentKey;
  //     // sse notification
  //     sseMsg = {
  //       type: "segment update",
  //       payload: newRule,
  //     };
  //     res.status(200).json({ payload: newRule });
  //   }
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ error: "Internal error occurred. Could not update segment." });
  // }

  // // do SSE notification sending here
  // clients.sendNotificationToAllClients(sseMsg);
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
    return res.status(500).json({ error: "Internal error occurred." }); // must support other res stats codes
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
  // need to add check for attribute being in rules - if yes, then NO DELETION!
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

      attr.set({ ...req.body });

      await attr.save({ fields: ["aKey", "name", "type"], transaction: t });
      return attr;
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message }); // must support other res stats codes && send back correct messages
  }
  let plainAttr = updatedAttr.get({ plain: true });
  delete plainAttr.id;
  return res.status(200).json({ payload: plainAttr });
};

// =================== SSE / SDK

export const sseNotifications = (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const clientId = clients.addNewClient(res);

  const connectMsg = `SSE connection established with client id: ${clientId}`;
  console.log(connectMsg);

  let data = `data: ${JSON.stringify({ msg: connectMsg })}\n\n`;
  res.write(data);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients.closeClient(clientId);
  });
};

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
