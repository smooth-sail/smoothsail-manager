import { getClient } from "../config/pg";

import {
  GET_ATTRIBUTES,
  GET_ATTRIBUTE_BY_KEY,
  CREATE_ATTRIBUTE,
  DELETE_ATTRIBUTE,
  UPDATE_ATTRIBUTE,
} from "../sql/attributes.queries";

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

const updateAttribute = async (attributeKey, { name, type }) => {
  const client = await getClient();
  const values = [name, type, attributeKey];
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
