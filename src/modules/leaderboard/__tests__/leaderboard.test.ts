import request from 'supertest';
import sqlite3, { Database } from 'sqlite3';
import { faker } from '@faker-js/faker';
import { createApp } from '../../../app';
import { LeaderboardRepository } from '../leaderboard.repository';
import { LeaderboardService } from '../leaderboard.service';
import { LeaderboardController } from '../leaderboard.controller';
import { createLeaderboardRouter } from '../leaderboard.routes';

let db: Database;
let app: any;

beforeAll(async () => {
  // Use in-memory sqlite database for tests
  db = new sqlite3.Database(':memory:');

  const repository = new LeaderboardRepository(db);
  const service = new LeaderboardService(repository);
  
  // Initialize table
  await new Promise<void>((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });

  const controller = new LeaderboardController(service);
  const router = createLeaderboardRouter(controller);

  app = createApp(router);
});

afterAll((done) => {
  db.close(done);
});

describe('Leaderboard API', () => {
  beforeEach(async () => {
    // Clear leaderboard before each test
    await new Promise<void>((resolve, reject) => {
      db.run(`DELETE FROM leaderboard`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  describe('GET /api/leaderboard (initially)', () => {
    let response: any;

    beforeEach(async () => {
      response = await request(app).get('/api/leaderboard');
    });

    it('should return 200 status', () => {
      expect(response.status).toBe(200);
    });

    it('should return an empty array', () => {
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/leaderboard (valid input)', () => {
    let response: any;
    let name: string;
    let score: number;

    beforeEach(async () => {
      name = faker.person.firstName();
      score = faker.number.int({ min: 100, max: 10000 });

      response = await request(app)
        .post('/api/leaderboard')
        .send({ name, score });
    });

    it('should return 201 status', () => {
      expect(response.status).toBe(201);
    });

    it('should return leaderboard with 1 entry', () => {
      expect(response.body.length).toBe(1);
    });

    it('should return the correct name in the first entry', () => {
      expect(response.body[0].name).toBe(name);
    });

    it('should return the correct score in the first entry', () => {
      expect(response.body[0].score).toBe(score);
    });

    it('should include an id property', () => {
      expect(response.body[0]).toHaveProperty('id');
    });

    it('should include a createdAt property', () => {
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/leaderboard (after 6 inserts)', () => {
    let response: any;

    beforeEach(async () => {
      // Insert 6 scores
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/leaderboard')
          .send({ 
            name: faker.person.firstName(), 
            score: faker.number.int({ min: 100, max: 1000 }) 
          });
      }
      response = await request(app).get('/api/leaderboard');
    });

    it('should return 200 status', () => {
      expect(response.status).toBe(200);
    });

    it('should return a leaderboard with only 5 entries', () => {
      expect(response.body.length).toBe(5);
    });
  });

  describe('POST /api/leaderboard (invalid input)', () => {
    let response: any;

    beforeEach(async () => {
      response = await request(app)
        .post('/api/leaderboard')
        .send({ name: faker.person.firstName() }); // Missing score
    });

    it('should return 400 status', () => {
      expect(response.status).toBe(400);
    });

    it('should return invalid input error message', () => {
      expect(response.body.message).toBe('Invalid input data');
    });
  });
});
