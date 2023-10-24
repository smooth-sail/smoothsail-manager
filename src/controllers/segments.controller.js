import pg from "../db/segments";
import Segment from "../models/segments";

export const getAllSegments = async (req, res) => {
  let segments;
  try {
    segments = await pg.getAllSegments();
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  res.status(200).json(segments);
};

export const getSegmentByKey = async (req, res) => {
  const segmentKey = req.params.s_key;

  let segment;
  try {
    segment = await pg.getSegment(segmentKey);
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    res
      .status(404)
      .json({ error: `Segment with key '${segmentKey}' does not exist` });
  }

  res.status(200).json(segment);
};

export const createSegment = async (req, res) => {
  try {
    let newSegment = new Segment(req.body);
    let segment = await pg.createSegment(newSegment);
    res.status(200).json(segment);
    // sse notification(?)
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const deleteSegment = async (req, res) => {
  const segmentKey = req.params.s_key;

  let segment;
  try {
    segment = pg.deleteSegment(segmentKey);
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
  try {
    segment = await pg.getSegment(segmentKey);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    res
      .status(404)
      .json({ error: `Segment with key '${segmentKey}' does not exist.` });
  }

  let newSegment = new Segment(segment);
  newSegment.updateProps(req.body);
  try {
    let updatedSegment = await pg.updateSegment(segmentKey, newSegment);
    res.status(200).json(updatedSegment);
    // sse notification(?)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not update segment." });
  }
};
