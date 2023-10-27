INSERT INTO
  flags (f_key, title, description, is_active)
VALUES
  ('flag-1', 'Flag 1', 'My cool first flag.', true),
  ('flag-2', 'Flag 2', 'My second flag.', true),
  ('flag-3', 'Flag 3', 'My third flag.', false);

INSERT INTO
  attributes (a_key, name, type)
VALUES
  ('email', 'User Email', 'string'),
  ('state', 'State of Residence in the USA', 'string'),
  ('beta-tester', 'Enrolled in beta testing', 'boolean'),
  ('age', 'User Age', 'number'),
  ('smth', 'loneley attr', 'string');

INSERT INTO
  segments (s_key, title, description, rules_operator)
VALUES
  ('internal-testers', 'Employees who test features', '', 'all'),
  ('pnw-millenials', 'WA residents over 30', 'weird test population', 'any'),
  ('no-rules-seg', 'Test seg 1', 'segment does not contain rules', 'all');

INSERT INTO
  flags_segments (flag_id, segment_id)
VALUES
  (1,1),
  (1, 2);

INSERT INTO
  rules (r_key, operator, value, segment_id, attributes_id)
VALUES
  ('1abc', 'contains', '@gmail.com', 1, 1),
  ('bcd2', '=', true, 1, 3),
  ('sl0', 'is', 'WA', 2, 2),
  ('97nd', '>=', 30, 2, 4);