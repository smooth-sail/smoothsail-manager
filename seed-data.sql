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
  rules (r_key, operator, value, segment_id, attribute_id)
VALUES
  ('e8d70b33-cd4a-48b8-a09d-961226ad9b72', 'contains', '@gmail.com', 1, 1),
  ('1c240416-e6f9-4ad3-9d59-e055ee243ca6', '=', true, 1, 3),
  ('e48a61c1-38ac-4a6e-ac0f-9f01b28f7a71', 'is', 'WA', 2, 2),
  ('e48a61c1-38ac-4a6e-ac0f-9f01b28f7a09', '>=', 30, 2, 4);