import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';

export const createLeaderboardRouter = (controller: LeaderboardController): Router => {
  const leaderboardRouter = Router();
  leaderboardRouter.get('/', controller.getTopScores.bind(controller));
  leaderboardRouter.post('/', controller.addScore.bind(controller));
  return leaderboardRouter;
};
