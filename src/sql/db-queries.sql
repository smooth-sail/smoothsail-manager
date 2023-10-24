-- ATTENTION: for many operations such as delete or update
-- I used db id column, not *_key column. *_key column is the one that
-- is exposed to the user, and 'id' is only for db internal operations.

-- SDK endpoint
-- GET /api/sdk/flags
-- not sure if r_key and s_key are needed in SDK!
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

-- UI and manager endpoints
-- Flags endpoints
-- GET /api/flags
SELECT f.f_key, f.title, f.description, f.is_active,
    f.created_at, f.updated_at
  FROM flags as f;
-- GET /api/flags/:id
SELECT * FROM flags WHERE f_key = $1;
-- POST /api/flags 
INSERT INTO flags (f_key, title, description) 
  VALUES ($1, $2, $3) 
  RETURNING *;
-- DELETE /api/flags/:id
DELETE FROM flags WHERE f_key = $1 
  RETURNING *;
-- PATCH /api/flags/:id
-- change flag's body data. It feels like on the UI changing title/description
-- will be one way, toggling - another way. so I create two queries for them.
UPDATE flags 
  SET (title, description) = ($1, $2) 
  WHERE id = $3 
  RETURNING *;
UPDATE flags 
  SET is_active = $1
  WHERE id = $2 
  RETURNING *;
-- add segment to a flag
INSERT INTO flags_segments (flags_id, segments_id)
  VALUES ($1, $2);
-- delete segment from flag
DELETE FROM flags_segments WHERE flags_id = $1 AND segments_id = $2;


-- Segments endpoints
-- GET /api/segments 
SELECT s.s_key, s.title, s.description, s.rules_operator,
    r.r_key, r.operator, r.value, a.a_key
  FROM segments as s
  LEFT JOIN rules as r
    ON s.id = r.segments_id
  LEFT JOIN attributes as a
    ON r.attributes_id = a.id;
-- GET /api/segments/:id
SELECT * FROM segments WHERE s_key = $1;
-- POST /api/segments 
INSERT INTO segments (s_key, title, description, rules_operator)
  VALUES ($1, $2, $3, $4) 
  RETURNING *;
-- DELETE /api/segments/:id
DELETE FROM segments WHERE s_key = $1 RETURNING *;
-- PATCH /api/segments/:id 
UPDATE segments 
  SET (title, description, rules_operator) = ($1, $2, $3) 
  WHERE id = $4 
  RETURNING *;

-- add rule to a segment
INSERT INTO
    rules (r_key, operator, value, segments_id, attributes_id)
  VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- delete rule from segment
DELETE FROM rules WHERE r_key = $1;


-- Attribute endpoints
-- GET /api/attributes 
SELECT a_key, name, type FROM attributes;
-- GET /api/attributes/:id
SELECT * FROM attributes WHERE a_key = $1;
-- POST /api/attributes 
INSERT INTO attributes (a_key, name, type)
  VALUES ($1, $2, $3) 
  RETURNING *;
-- DELETE  /api/attributes/:id
DELETE FROM attributes WHERE a_key = $1;
-- PUT /api/attributes/:id 
UPDATE attributes SET (name, type) = ($1, $2) 
  WHERE id = $3 RETURNING *;