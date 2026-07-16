import { getDb } from '../../core/db/sqlite';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: string;
}

export class LeaderboardRepository {
  public async initTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        `CREATE TABLE IF NOT EXISTS leaderboard (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          score INTEGER NOT NULL,
          createdAt TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error('Error creating table', err.message);
            reject(err);
          } else {
            console.log('Leaderboard table ready');
            resolve();
          }
        }
      );
    });
  }
  public async getTopScores(limit: number = 5): Promise<LeaderboardEntry[]> {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all(
        `SELECT id, name, score, createdAt FROM leaderboard ORDER BY score DESC, createdAt ASC LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as LeaderboardEntry[]);
          }
        }
      );
    });
  }

  public async insertScore(entry: LeaderboardEntry): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        `INSERT INTO leaderboard (id, name, score, createdAt) VALUES (?, ?, ?, ?)`,
        [entry.id, entry.name, entry.score, entry.createdAt],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public async trimLeaderboard(keepCount: number = 5): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run(
        `DELETE FROM leaderboard WHERE id NOT IN (
          SELECT id FROM leaderboard ORDER BY score DESC, createdAt ASC LIMIT ?
        )`,
        [keepCount],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
