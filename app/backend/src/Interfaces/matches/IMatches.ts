export interface IMatches {
  id: number,
  homeTeamId: number,
  homeTeamGoals: number
  awayTeamId: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface IMatchesResult {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface IMatchesCreate {
  homeTeamId: number,
  homeTeamGoals: number
  awayTeamId: number,
  awayTeamGoals: number,
}

export interface ILeaderboardHome {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
}
