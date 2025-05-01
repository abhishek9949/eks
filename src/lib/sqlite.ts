import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function openDb() {
  db ??= new Database("./cookies.db");
  return db;
}
