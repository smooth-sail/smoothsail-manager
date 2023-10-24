export const GET_ALL_SEGMENTS =
  "SELECT s.s_key, s.title, s.description, s.rules_operator, r.r_key, r.operator, r.value, a.a_key FROM segments as s LEFT JOIN rules as r ON s.id = r.segments_id LEFT JOIN attributes as a ON r.attributes_id = a.id;";
export const GET_SEGMENT_BY_KEY = "SELECT * FROM segments WHERE s_key = $1;";
export const CREATE_SEGMENT =
  "INSERT INTO segments (s_key, title, description, rules_operator) VALUES ($1, $2, $3, $4) RETURNING *;";
export const DELETE_SEGMENT =
  "DELETE FROM segments WHERE s_key = $1 RETURNING *;";
export const UPDATE_SEGMENT_INFO =
  "UPDATE segments SET (title, description, rules_operator) = ($1, $2, $3) WHERE id = $4 RETURNING *;";
export const ADD_RULE_TO_SEGMENT =
  "INSERT INTO rules (r_key, operator, value, segments_id, attributes_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
export const DELETE_RULE_FROM_SEGMENT = "DELETE FROM rules WHERE r_key = $1;";
