import { openDb } from './sqlite';

export async function initDB() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS current_account_cookie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accounts_json TEXT,
      unique_id TEXT UNIQUE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS current_role_cookie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER,
      role_name TEXT,
      unique_id TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS permission_cookie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      permissions_json TEXT,
      unique_id TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_cookie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      full_name TEXT,
      profile TEXT,
      organization_id INTEGER,
      unique_id TEXT,
      user_id INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS token_cookie (
      token TEXT,
      unique_id TEXT
    );
  `);
}
