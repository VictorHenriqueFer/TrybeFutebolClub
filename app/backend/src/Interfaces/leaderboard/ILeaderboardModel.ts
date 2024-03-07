import { ILeaderboardHome } from '../matches/IMatches';

export interface ILeaderboardModel {
  getGoals(route: 'home' | 'away'): Promise<ILeaderboardHome[]>
  getLeaderBoardOrder(route: 'home' | 'away'): Promise<ILeaderboardHome[]>
}
