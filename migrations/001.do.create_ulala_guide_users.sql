CREATE TABLE ulala_guide_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  classes TEXT NOT NULL DEFAULT ''
)