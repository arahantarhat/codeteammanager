// init-db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { existsSync } from 'fs';

const DB_FILE = './codeteam.sqlite';

const init = async () => {
  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      apellido TEXT,
      email TEXT UNIQUE,
      password TEXT,
      rol TEXT
    );
  `);

  console.log(`Base de datos ${existsSync(DB_FILE) ? 'actualizada' : 'creada'}: ${DB_FILE}`);
};

init().catch(err => {
  console.error('Error inicializando la base de datos:', err);
});
