// db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initDb = async () => {
  return open({
    filename: './codeteam.sqlite',
    driver: sqlite3.Database
  });
};
