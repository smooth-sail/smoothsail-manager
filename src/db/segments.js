import { getClient } from "../config/pg";

const getAllSegments = async () => {
  const client = await getClient();
  const { rows } = await client.query(GET_ALL_SEGMENTS);
  client.release();
  return rows;
};

const getSegment = async (segmentId) => {
  const client = await getClient();
  const { rows } = await client.query(GET_SEGMENT, [segmentId]);
  client.release();
  return rows[0];
};

const createSegment = async ({ s_key, title, rules_operator }) => {
  const client = await getClient();
  const values = [s_key, title, rules_operator];
  const { rows } = await client.query(CREATE_SEGMENT, values);
  client.release();
  return rows[0];
};

const deleteSegment = async (segmentId) => {
  const client = await getClient();
  const { rows } = await client.query(DELETE_SEGMENT, [segmentId]);
  client.release();
  return rows[0];
};

const updateSegment = async (segmentId, { s_key, title, rules_operator }) => {
  const client = await getClient();
  const values = [s_key, title, rules_operator, segmentId];
  const { rows } = await client.query(UPDATE_SEGMENT, values);
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
