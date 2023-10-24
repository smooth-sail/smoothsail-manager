export const GET_FLAGS =
  "SELECT f.f_key, f.title, f.description, f.is_active, f.created_at, f.updated_at FROM flags as f;";
export const GET_FLAG_BY_KEY = "SELECT * FROM flags WHERE f_key = $1;";
export const CREATE_FLAG =
  "INSERT INTO flags (f_key, title, description) VALUES ($1, $2, $3) RETURNING *;";
export const DELETE_FLAG = "DELETE FROM flags WHERE f_key = $1 RETURNING *;";
export const UPDATE_FLAG_INFO =
  "UPDATE flags SET title = $1, description = $2 WHERE id = $3 RETURNING *;";
export const UPDATE_FLAG_STATUS =
  "UPDATE flags SET is_active = $1, updated_at = current_timestamp WHERE f_key = $2 RETURNING *;";
// -- add segment to a flag
export const ADD_SEGMENT_TO_FLAG =
  "INSERT INTO flags_segments (flags_id, segments_id) VALUES ($1, $2);";
export const UPDATE_FLAG_UPDATED_DATE =
  "UPDATE flags SET updated_at = current_timestamp WHERE f_key = $1 RETURNING *;";
// !!! and update flag too: , updated_at = current_timestamp
// -- delete segment from flag
export const DELETE_SEGMENT_FROM_FLAG =
  "DELETE FROM flags_segments WHERE flags_id = $1 AND segments_id = $2;";
// !!! and update flag too: , updated_at = current_timestamp
