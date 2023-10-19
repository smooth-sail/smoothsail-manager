DROP TABLE IF EXISTS flags;

CREATE TABLE
  flags (
    id serial PRIMARY KEY,
    f_key varchar(20) NOT NULL UNIQUE,
    title varchar(100) NOT NULL UNIQUE,
    description text,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp
  );
