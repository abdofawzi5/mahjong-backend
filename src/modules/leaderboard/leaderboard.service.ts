import { LeaderboardRepository, LeaderboardEntry } from './leaderboard.repository';
import crypto from 'crypto';

export class LeaderboardService {
  private repository: LeaderboardRepository;

  constructor(repository: LeaderboardRepository) {
    this.repository = repository;
  }

  public async init(): Promise<void> {
    await this.repository.initTable();
  }

  public async getTopScores(): Promise<LeaderboardEntry[]> {
    return this.repository.getTopScores();
  }

  public async addScore(name: string, score: number): Promise<LeaderboardEntry[]> {
    const entry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      name,
      score,
      createdAt: new Date().toISOString()
    };
    await this.repository.insertScore(entry);
    await this.repository.trimLeaderboard(5);
    return this.repository.getTopScores();
  }
}
