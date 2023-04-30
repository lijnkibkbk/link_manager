const {getDbConnection} = require('../config/database');

const db = getDbConnection();
db.serialize(() => {
    // Створити таблицю links
    db.run(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      archived BOOLEAN DEFAULT FALSE,
      archived_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Створити таблицю tags
    db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

    // Створити таблицю many-to-many link_tags
    db.run(`
    CREATE TABLE IF NOT EXISTS link_tags (
      link_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (link_id, tag_id),
      FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    )
  `);
});

