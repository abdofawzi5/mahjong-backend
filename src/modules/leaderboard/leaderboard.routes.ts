import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';

export const leaderboardRouter = Router();
const controller = new LeaderboardController();

leaderboardRouter.get('/', controller.getTopScores.bind(controller));
leaderboardRouter.post('/', controller.addScore.bind(controller));
