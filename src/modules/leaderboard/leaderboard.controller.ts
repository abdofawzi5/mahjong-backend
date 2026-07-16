import { Request, Response } from 'express';
import { LeaderboardService } from './leaderboard.service';

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  public async getTopScores(req: Request, res: Response): Promise<void> {
    try {
      const scores = await leaderboardService.getTopScores();
      res.json(scores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async addScore(req: Request, res: Response): Promise<void> {
    try {
      const { name, score } = req.body;
      if (!name || typeof score !== 'number') {
        res.status(400).json({ message: 'Invalid input data' });
        return;
      }
      const updatedLeaderboard = await leaderboardService.addScore(name, score);
      res.status(201).json(updatedLeaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
