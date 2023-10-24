export const GET_ATTRIBUTES = "SELECT a_key, name, type FROM attributes;";
export const GET_ATTRIBUTE_BY_KEY =
  "SELECT * FROM attributes WHERE a_key = $1;";
export const CREATE_ATTRIBUTE =
  "INSERT INTO attributes (a_key, name, type) VALUES ($1, $2, $3) RETURNING *;";
export const DELETE_ATTRIBUTE = "DELETE FROM attributes WHERE a_key = $1;";
export const UPDATE_ATTRIBUTE =
  "UPDATE attributes SET (name, type) = ($1, $2) WHERE id = $3 RETURNING *;";
