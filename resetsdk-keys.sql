DROP TABLE IF EXISTS sdk_keys;
CREATE TABLE
sdk_keys (
  id serial PRIMARY KEY,
  sdk_key varchar(50) NOT NULL UNIQUE CHECK (sdk_key ~ '^[A-Za-z0-9]+$'),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  deleted_at timestamp with time zone
);