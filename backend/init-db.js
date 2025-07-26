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

    CREATE TABLE IF NOT EXISTS equipos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      descripcion TEXT,
      creador_id INTEGER,
      FOREIGN KEY(creador_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS usuarios_equipos (
      usuario_id INTEGER,
      equipo_id INTEGER,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY(equipo_id) REFERENCES equipos(id)
    );

    CREATE TABLE IF NOT EXISTS invitaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      equipo_id INTEGER,
      estado TEXT DEFAULT 'pendiente',
      FOREIGN KEY(equipo_id) REFERENCES equipos(id)
    );
    
    CREATE TABLE IF NOT EXISTS problemas_asignados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipo_id INTEGER,
      nombre TEXT,
      contest_id INTEGER,
      indice TEXT,
      codeforces_id TEXT,
      fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(equipo_id) REFERENCES equipos(id)
    );
  `);

  console.log(`Base de datos ${existsSync(DB_FILE) ? 'actualizada' : 'creada'}: ${DB_FILE}`);
};

init().catch(err => {
  console.error('Error inicializando la base de datos:', err);
});
