CREATE TABLE IF NOT EXISTS projects (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL CHECK(category IN ('industry-work', 'creative-direction', 'photography')),
  cover_image  TEXT NOT NULL,
  images       TEXT NOT NULL DEFAULT '[]',  -- JSON array of image paths
  description  TEXT,
  client       TEXT,
  role         TEXT,
  year         INTEGER,
  tags         TEXT NOT NULL DEFAULT '[]'   -- JSON array of strings
);
