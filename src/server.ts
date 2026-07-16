import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { LeaderboardService } from './modules/leaderboard/leaderboard.service';
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', leaderboardRouter);

const startServer = async () => {
  try {
    const leaderboardService = new LeaderboardService();
    await leaderboardService.init();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
