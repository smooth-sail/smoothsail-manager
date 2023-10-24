import { getClient } from "../config/pg";

// Temporary queries, need to use imported constants later
const GET_ALL_ATTRIBUTES = "SELECT a_key, name, type FROM attributes;";

const GET_ATTRIBUTE = "SELECT * FROM attributes WHERE a_key = $1;";

const CREATE_ATTRIBUTE = `
  INSERT INTO attributes (a_key, name, type)
  VALUES ($1, $2, $3) 
  RETURNING *;
`;

const DELETE_ATTRIBUTE = "DELETE FROM attributes WHERE a_key = $1;";

const UPDATE_ATTRIBUTE = `
  UPDATE attributes SET (name, type) = ($1, $2) 
  WHERE id = $3 RETURNING *;
`;

const getAllAttributes = async () => {
  const client = await getClient();
  const { rows } = await client.query(GET_ALL_ATTRIBUTES);
  client.release();
  return rows;
};

const getAttribute = async (attributeKey) => {
  const client = await getClient();
  const { rows } = await client.query(GET_ATTRIBUTE, [attributeKey]);
  client.release();
  return rows[0];
};

const createAttribute = async ({ a_key, name, type }) => {
  const client = await getClient();
  const values = [a_key, name, type];
  const { rows } = await client.query(CREATE_ATTRIBUTE, values);
  client.release();
  return rows[0];
};

const deleteAttribute = async (attributeKey) => {
  const client = await getClient();
  const { rows } = await client.query(DELETE_ATTRIBUTE, [attributeKey]);
  client.release();
  return rows[0];
};

const updateAttribute = async (id, { name, type }) => {
  const client = await getClient();
  const values = [name, type, id];
  const { rows } = await client.query(UPDATE_ATTRIBUTE, values);
  client.release();
  return rows[0];
};

export default {
  getAllAttributes,
  getAttribute,
  createAttribute,
  deleteAttribute,
  updateAttribute,
};
