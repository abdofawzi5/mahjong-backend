import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, process.env.DB_PATH || '../../../database.sqlite');

let dbInstance: Database | null = null;

export const getDb = (): Database => {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database', err.message);
      }
    });
  }
  return dbInstance;
};

