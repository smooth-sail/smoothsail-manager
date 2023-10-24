DROP TABLE IF EXISTS flags_segments, rules, flags, attributes, segments;

CREATE TABLE
  flags (
    id serial PRIMARY KEY,
    f_key varchar(20) NOT NULL UNIQUE CHECK (f_key ~ '^[A-Za-z0-9._-]+$'),
    title varchar(100) NOT NULL DEFAULT '',
    description text,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp
  );

CREATE TABLE
  segments (
    id serial PRIMARY KEY,
    s_key varchar(20) NOT NULL UNIQUE CHECK (s_key ~ '^[A-Za-z0-9._-]+$'),
    title varchar(100) NOT NULL UNIQUE,
    description text DEFAULT '',
    rules_operator varchar(20) CHECK (rules_operator IN ('all', 'any'))
  );

CREATE TABLE
  attributes (
    id serial PRIMARY KEY,
    a_key varchar(20) NOT NULL UNIQUE CHECK (a_key ~ '^[A-Za-z0-9._-]+$'),
    name varchar(100) NOT NULL UNIQUE,
    type varchar(20) CHECK (type IN ('boolean', 'string', 'number'))
  );

CREATE TABLE
  flags_segments (
    id serial PRIMARY KEY,
    flags_id integer NOT NULL,
    segments_id integer NOT NULL,
    FOREIGN KEY (flags_id) REFERENCES flags (id) ON DELETE CASCADE,
    FOREIGN KEY (segments_id) REFERENCES segments (id) ON DELETE CASCADE
  );

CREATE TABLE
  rules (
    id serial PRIMARY KEY,
    r_key varchar(20) NOT NULL UNIQUE CHECK (r_key ~ '^[A-Za-z0-9._-]+$'),
    operator varchar(50) NOT NULL,
    value text,
    segments_id integer NOT NULL,
    attributes_id integer NOT NULL,
    FOREIGN KEY (segments_id) REFERENCES segments (id) ON DELETE CASCADE,
    FOREIGN KEY (attributes_id) REFERENCES attributes (id) ON DELETE CASCADE
  );