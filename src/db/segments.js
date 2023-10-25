import { getClient } from "../config/pg";

import {
  GET_ALL_SEGMENTS,
  GET_SEGMENT_BY_KEY,
  CREATE_SEGMENT,
  DELETE_SEGMENT,
  UPDATE_SEGMENT_INFO,
  GET_SEGMENT_BY_FLAG_KEY,
  ADD_RULE,
  REMOVE_RULE,
  UPDATE_RULE,
} from "../sql/segment.queries";

const getAllSegments = async () => {
  const client = await getClient();
  const { rows } = await client.query(GET_ALL_SEGMENTS);
  client.release();
  return rows;
};

const getSegmentByFlagKey = async (flagKey) => {
  const client = await getClient();
  const { rows } = await client.query(GET_SEGMENT_BY_FLAG_KEY, [flagKey]);
  client.release();
  return rows;
};

const getSegment = async (segmentKey) => {
  const client = await getClient();
  const { rows } = await client.query(GET_SEGMENT_BY_KEY, [segmentKey]);
  client.release();
  return rows;
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

const addRule = async ({
  r_key,
  operator,
  value,
  segments_id,
  attributes_id,
}) => {
  const client = await getClient();

  const values = [r_key, operator, value, segments_id, attributes_id];
  console.log(values);
  const { rows } = await client.query(ADD_RULE, values);
  client.release();
  return rows[0];
};

const removeRule = async (r_key) => {
  const client = await getClient();
  const { rows } = await client.query(REMOVE_RULE, [r_key]);
  client.release();
  return rows[0];
};

const updateRule = async ({ operator, value, a_key, r_key }) => {
  const client = await getClient();
  const values = [operator, value, a_key, r_key];
  console.log(UPDATE_RULE, values);
  // (operator, value, attributes_id) = ($1, $2, $3) WHERE r_key = $4
  const { rows } = await client.query(UPDATE_RULE, values);
  client.release();
  return rows[0];
};

export default {
  getAllSegments,
  getSegmentByFlagKey,
  getSegment,
  createSegment,
  deleteSegment,
  updateSegment,
  addRule,
  removeRule,
  updateRule,
};
