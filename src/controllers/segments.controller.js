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

export const getSegmentById = async (req, res) => {
  const segmentId = req.params.id;

  let segment;
  try {
    segment = await pg.getSegment(segmentId);
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    res
      .status(404)
      .json({ error: `Segment with id ${segmentId} does not exist` });
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
  const segmentId = req.params.id;

  let segment;
  try {
    segment = pg.deleteSegment(segmentId);
    if (!segment) {
      res
        .status(404)
        .json({ error: `Segment with id ${segmentId} does not exist.` });
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
  const segmentId = req.params.id;

  let segment;
  try {
    segment = await pg.getSegment(segmentId);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!segment) {
    res
      .status(404)
      .json({ error: `Segment with id ${segmentId} does not exist.` });
  }

  let newSegment = new Segment(segment);
  newSegment.updateProps(req.body);
  try {
    let updatedSegment = await pg.updateSegment(segmentId, newSegment);
    res.status(200).json(updatedSegment);
    // sse notification(?)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not update segment." });
  }
};
