import { getClient } from "../config/pg";
import * as queries from "../sql/flag.queries";

const getAllFlags = async () => {
  const client = await getClient();
  const { rows } = await client.query(queries.GET_FLAGS);
  client.release();
  return rows;
};

const getFlag = async (flagKey) => {
  const client = await getClient();
  const { rows } = await client.query(queries.GET_FLAG_BY_KEY, [flagKey]);
  client.release();
  return rows[0];
};

const createFlag = async ({ f_key, title, description }) => {
  const client = await getClient();
  const values = [f_key, title, description];
  const { rows } = await client.query(queries.CREATE_FLAG, values);
  client.release();
  return rows[0];
};

const deleteFlag = async (flagKey) => {
  const client = await getClient();
  const { rows } = await client.query(queries.DELETE_FLAG, [flagKey]);
  client.release();
  return rows[0];
};

const updateFlagInfo = async ({ id, title, description }) => {
  console.log(title, description);
  const client = await getClient();
  const values = [title, description, id];
  const { rows } = await client.query(queries.UPDATE_FLAG_INFO, values);
  client.release();
  return rows[0];
};

const updateIsActive = async ({ f_key, is_active }) => {
  const client = await getClient();
  const values = [is_active, f_key];
  const { rows } = await client.query(queries.UPDATE_FLAG_STATUS, values);
  client.release();
  return rows[0];
};

const addSegment = async (f_id, s_id) => {
  const client = await getClient();
  const { rows } = await client.query(queries.ADD_SEGMENT_TO_FLAG, [
    f_id,
    s_id,
  ]);
  client.release();
  return rows[0];
};

// Temporary query
const GET_SDK_FLAGS = `
  SELECT f.f_key, f.is_active, f.updated_at,
      s.s_key, s.rules_operator,
      a.a_key, a.type, r.operator, r.value, r.r_key
  FROM flags as f 
  LEFT JOIN flags_segments as fs 
    ON f.id = fs.flags_id
  LEFT JOIN segments as s
    ON fs.segments_id = s.id
  LEFT JOIN rules as r
    ON r.segments_id = s.id
  LEFT JOIN attributes as a
    ON a.id = r.attributes_id;
  `;

const getSdkFlags = async () => {
  const client = await getClient();
  const { rows } = await client.query(GET_SDK_FLAGS);
  client.release();
  return rows;
};

export default {
  getAllFlags,
  getFlag,
  createFlag,
  deleteFlag,
  updateFlagInfo,
  updateIsActive,
  addSegment,
  getSdkFlags,
};
