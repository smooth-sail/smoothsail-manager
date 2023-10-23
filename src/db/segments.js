import { getClient } from "../config/pg";

// Temporary queries, need to use imported constants later
const GET_ALL_SEGMENTS = `
 SELECT s.id, s.s_key, s.title, s.description, s.rules_operator,
     r.r_key, r.operator, r.value, a.a_key
   FROM segments as s
   LEFT JOIN rules as r
     ON s.id = r.segments_id
   LEFT JOIN attributes as a
     ON r.attributes_id = a.id;
`;
const GET_SEGMENT = "SELECT * FROM segments WHERE id = $1;";
const CREATE_SEGMENT = `
  INSERT INTO segments (s_key, title, description, rules_operator)
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
`;
const DELETE_SEGMENT = "DELETE FROM segments WHERE id = $1 RETURNING *;";
const UPDATE_SEGMENT = `
  UPDATE segments 
    SET (s_key, title, rules_operator) = ($1, $2, $3) 
    WHERE id = $4
    RETURNING *;
`;

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
  console.log(s_key, title, rules_operator);
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
