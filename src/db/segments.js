import { getClient } from "../config/pg";

import {
  GET_ALL_SEGMENTS,
  GET_SEGMENT_BY_KEY,
  CREATE_SEGMENT,
  DELETE_SEGMENT,
  UPDATE_SEGMENT_INFO,
} from "../sql/segment.queries";

const getAllSegments = async () => {
  const client = await getClient();
  const { rows } = await client.query(GET_ALL_SEGMENTS);
  client.release();
  return rows;
};

const getSegment = async (segmentKey) => {
  const client = await getClient();
  const { rows } = await client.query(GET_SEGMENT_BY_KEY, [segmentKey]);
  client.release();
  return rows[0];
};

const createSegment = async ({
  s_key: segmentKey,
  title,
  description,
  rules_operator,
}) => {
  const client = await getClient();
  console.log(segmentKey, title, description, rules_operator);
  const values = [segmentKey, title, description, rules_operator];
  const { rows } = await client.query(CREATE_SEGMENT, values);
  // Should rows also be created when segments are created?
  // Need to know what format this information will be sent over from UI if there aren't separate API endpoints.
  client.release();
  return rows[0];
};

const deleteSegment = async (segmentKey) => {
  const client = await getClient();
  const { rows } = await client.query(DELETE_SEGMENT, [segmentKey]);
  client.release();
  return rows[0];
};

const updateSegment = async (id, { title, description, rules_operator }) => {
  const client = await getClient();
  const values = [title, description, rules_operator, id];
  const { rows } = await client.query(UPDATE_SEGMENT_INFO, values);
  client.release();
  return rows[0];
};

export default {
  getAllSegments,
  getSegment,
  createSegment,
  deleteSegment,
  updateSegment,
};
