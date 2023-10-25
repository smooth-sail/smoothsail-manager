import pgS from "../db/segments";
import Segment from "../models/segments";
import pgA from "../db/attributes";

function generateRandomString() {
  const allowedCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
  let randomString = "";

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
    randomString += allowedCharacters[randomIndex];
  }

  return randomString;
}

const parseSegmRows = (segments) => {
  let result = [];
  segments.forEach((s) => {
    if (result.length === 0 || result[result.length - 1].s_key !== s.s_key) {
      let newSeg = {
        s_key: s.s_key,
        title: s.title,
        description: s.description,
        rules_operator: s.rules_operator,
        rules: [],
      };

      if (s.r_key) {
        newSeg.rules.push({
          r_key: s.r_key,
          a_key: s.a_key,
          type: s.type,
          operator: s.operator,
          value: s.value,
        });
      }
      result.push(newSeg);
    } else {
      if (s.r_key) {
        result[result.length - 1].rules.push({
          r_key: s.r_key,
          a_key: s.a_key,
          type: s.type,
          operator: s.operator,
          value: s.value,
        });
      }
    }
  });
  return result;
};

export const getAllSegments = async (req, res) => {
  let flagKey = req.query.f_key;

  try {
    let segments;
    if (flagKey) {
      // should check if flag exists and give appropriate error.
      segments = await pgS.getSegmentByFlagKey(flagKey);
    } else {
      segments = await pgS.getAllSegments();
    }
    const result = parseSegmRows(segments);

    res.status(200).json({ payload: result });
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const getSegmentByKey = async (req, res) => {
  const segmentKey = req.params.s_key;

  let segment;
  try {
    let segmentRows = await pgS.getSegment(segmentKey);
    segment = parseSegmRows(segmentRows)[0];
  } catch (err) {
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    return res
      .status(404)
      .json({ error: `Segment with key '${segmentKey}' does not exist` });
  }

  res.status(200).json({ payload: segment });
};

export const createSegment = async (req, res) => {
  try {
    let newSegment = new Segment(req.body);
    let segmentVals = await pgS.createSegment(newSegment);
    let segment = new Segment(segmentVals);

    res.status(200).json({ payload: segment });

    // sse notification(?)
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const deleteSegment = async (req, res) => {
  const segmentKey = req.params.s_key;

  let segment;
  try {
    segment = pgS.deleteSegment(segmentKey);
    if (!segment) {
      res
        .status(404)
        .json({ error: `Segment with key '${segmentKey}' does not exist.` });
      return;
    }

    res.status(200).json({ message: "Segment successfully deleted." });
    // sse notification(?)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete segment." });
  }
};

export const updateSegment = async (req, res) => {
  const segmentKey = req.params.s_key;

  let segment;
  let segmentId;
  try {
    let segmentRows = await pgS.getSegment(segmentKey);
    segmentId = segmentRows[0] ? segmentRows[0].id : undefined;
    segment = parseSegmRows(segmentRows)[0];
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    res
      .status(404)
      .json({ error: `Segment with key '${segmentKey}' does not exist.` });
  }

  try {
    if (req.body.action === "body update") {
      let newSegment = new Segment(segment);

      newSegment.updateProps(req.body.payload);
      let updatedSegment = await pgS.updateSegment(segmentId, newSegment);
      delete updatedSegment.rules;
      delete updatedSegment.id;
      res.status(200).json({ payload: updatedSegment });
      // sse notification (since any could have been updated)
    } else if (req.body.action === "rule add") {
      let attribute = await pgA.getAttribute(req.body.payload.a_key);
      // if no attribute - return 404;

      let ruleSet = {
        r_key: generateRandomString(),
        operator: req.body.payload.operator,
        value: req.body.payload.value,
        segments_id: segmentId,
        attributes_id: attribute.id,
      };

      let newRule = await pgS.addRule(ruleSet);

      delete newRule.id;
      delete newRule.segments_id;
      delete newRule.attributes_id;
      newRule.a_key = req.body.payload.a_key;
      newRule.s_key = segmentKey;
      // sse notification
      res.status(200).json({ payload: newRule });
    } else if (req.body.action === "rule remove") {
      let r_key = req.body.payload.r_key;
      let removedRule = await pgS.removeRule(r_key, segmentKey);
      if (!removedRule) {
        res
          .status(404)
          .json({ error: `Rule with key '${r_key}' does not exist.` });
        return;
      }
      // sse notification
      res.status(200).json({ message: "Rule successfully deleted." });
    } else if (req.body.action === "rule update") {
      let attribute = await pgA.getAttribute(req.body.payload.a_key);
      console.log(attribute);
      // if no attribute - return 404;

      let ruleSet = {
        operator: req.body.payload.operator,
        value: req.body.payload.value,
        a_key: attribute.id,
        r_key: req.body.payload.r_key,
      };

      let newRule = await pgS.updateRule(ruleSet);

      delete newRule.id;
      delete newRule.segments_id;
      delete newRule.attributes_id;
      newRule.a_key = attribute.a_key;
      newRule.s_key = segmentKey;
      // sse notification
      res.status(200).json({ payload: newRule });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not update segment." });
  }
};
