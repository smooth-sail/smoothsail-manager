DROP TABLE IF EXISTS flags_segments, rules, flags, attributes, segments;

CREATE TABLE
  flags (
    id serial PRIMARY KEY,
    f_key varchar(20) NOT NULL UNIQUE CHECK (f_key ~ '^[A-Za-z0-9._-]+$'),
    title varchar(100) NOT NULL,
    description text NOT NULL DEFAULT '',
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp
  );

CREATE TABLE
  segments (
    id serial PRIMARY KEY,
    s_key varchar(20) NOT NULL UNIQUE CHECK (s_key ~ '^[A-Za-z0-9._-]+$'),
    title varchar(100) NOT NULL UNIQUE,
    description text DEFAULT 'all',
    rules_operator varchar(20) CHECK (rules_operator IN ('all', 'any'))
  );

CREATE TABLE
  attributes (
    id serial PRIMARY KEY,
    a_key varchar(20) NOT NULL UNIQUE CHECK (a_key ~ '^[A-Za-z0-9._-]+$'),
    name varchar(100) NOT NULL DEFAULT '',
    type varchar(20) CHECK (type IN ('boolean', 'string', 'number'))
  );

CREATE TABLE
  flags_segments (
    id serial,
    flag_id integer NOT NULL,
    segment_id integer NOT NULL,
    FOREIGN KEY (flag_id) REFERENCES flags (id) ON DELETE CASCADE,
    FOREIGN KEY (segment_id) REFERENCES segments (id) ON DELETE CASCADE,
    UNIQUE (flag_id, segment_id),
    PRIMARY KEY (flag_id, segment_id)
  );

CREATE TABLE
  rules (
    id serial PRIMARY KEY,
    r_key uuid NOT NULL UNIQUE,
    operator varchar(50) NOT NULL,
    value text,
    segment_id integer NOT NULL,
    attribute_id integer NOT NULL,
    FOREIGN KEY (segment_id) REFERENCES segments (id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES attributes (id) ON DELETE CASCADE
  );