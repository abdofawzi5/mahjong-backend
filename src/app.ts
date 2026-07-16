import express, { Router } from 'express';
import cors from 'cors';

export const createApp = (leaderboardRouter: Router) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/leaderboard', leaderboardRouter);

  return app;
};
