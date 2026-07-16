import 'dotenv/config';
import { createApp } from './app';
import { getDb } from './core/db/sqlite';
import { LeaderboardRepository } from './modules/leaderboard/leaderboard.repository';
import { LeaderboardService } from './modules/leaderboard/leaderboard.service';
import { LeaderboardController } from './modules/leaderboard/leaderboard.controller';
import { createLeaderboardRouter } from './modules/leaderboard/leaderboard.routes';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    const db = getDb();
    const leaderboardRepository = new LeaderboardRepository(db);
    
    // Initialize table before handling requests
    await leaderboardRepository.initTable();

    const leaderboardService = new LeaderboardService(leaderboardRepository);
    const leaderboardController = new LeaderboardController(leaderboardService);
    const leaderboardRouter = createLeaderboardRouter(leaderboardController);

    const app = createApp(leaderboardRouter);
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
