import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { ILeaderboardModel } from '../Interfaces/leaderboard/ILeaderboardModel';
import { ILeaderboard } from '../Interfaces/matches/IMatches';
import { Route, Team, TeamsGol } from '../utils/types';
import MatchesModel from './MatchsModel';

export default class LeaderModel implements ILeaderboardModel {
  private teamModel = SequelizeTeams;
  private matchModel = new MatchesModel();

  async createdTeams() {
    const teams = await this.teamModel.findAll({ attributes: { exclude: ['id'] } });

    const allMatches = await this.matchModel.getMathfilter(false) as (SequelizeMatches & {
      homeTeam: { teamName: string };
      awayTeam: { teamName: string }
    }) [];

    const team = teams.map(({ teamName }) => ({
      name: teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }));

    return { allMatches, team };
  }

  async getPointsHome() {
    const { allMatches, team: newTeams } = await this.createdTeams();

    const infoTeams = newTeams.map((newTeam) => {
      const team = { ...newTeam };

      const matches = allMatches.filter((match) => match.homeTeam.teamName === team.name);

      const defeat = matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;

      const wins = matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;

      const draws = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;

      team.totalDraws += draws;
      team.totalVictories += wins;
      team.totalLosses += defeat;
      team.totalGames += matches.length;
      team.totalPoints += (3 * wins) + draws;
      return team;
    });

    return infoTeams;
  }

  async getPointsAway() {
    const { allMatches, team: newTeams } = await this.createdTeams();

    const infoTeams = newTeams.map((newTeam) => {
      const team = { ...newTeam };

      const matches = allMatches.filter((match) => match.awayTeam.teamName === team.name);

      const defeat = matches.filter((match) => match.awayTeamGoals < match.homeTeamGoals).length;

      const wins = matches.filter((match) => match.awayTeamGoals > match.homeTeamGoals).length;

      const draws = matches.filter((match) => match.awayTeamGoals === match.homeTeamGoals).length;

      team.totalDraws += draws;
      team.totalVictories += wins;
      team.totalLosses += defeat;
      team.totalGames += matches.length;
      team.totalPoints += (3 * wins) + draws;
      return team;
    });
    return infoTeams;
  }

  joinsTeams(team: Team, teamStatics: Team) {
    console.log(this);
    const totalPoints = team.totalPoints + teamStatics.totalPoints;
    const totalGames = team.totalGames + teamStatics.totalGames;

    return ({
      name: team.name,
      totalPoints,
      totalGames,
      totalVictories: team.totalVictories + teamStatics.totalVictories,
      totalDraws: team.totalDraws + teamStatics.totalDraws,
      totalLosses: team.totalLosses + teamStatics.totalLosses,
      goalsFavor: team.goalsFavor + teamStatics.goalsFavor,
      goalsOwn: team.goalsOwn + teamStatics.goalsOwn,
      goalsBalance: team.goalsBalance + teamStatics.goalsBalance,
      efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
    });
  }

  async getTotalPoints() {
    const leaderboardHome : Team[] = await this.getGoals('home');
    const leaderboardAway : Team[] = await this.getGoals('away');
    return leaderboardHome.map((team) => {
      const teamStatics = leaderboardAway.find((teamAway) => teamAway.name === team.name);
      if (teamStatics) {
        return this.joinsTeams(team, teamStatics);
      }
      return team;
    });
  }

  selectTeam = async (route: Route) => {
    if (route === 'home') {
      return this.getPointsHome();
    }
    if (route === 'away') {
      return this.getPointsAway();
    }
    return this.getTotalPoints();
  };

  getHome(team: Team, allMatches: ILeaderboard[]) {
    console.log(this);
    const teamGoals = allMatches
      .filter((match) => match.homeTeam.teamName === team.name).reduce((acc, cur) => {
        acc.goalsFavor += cur.homeTeamGoals;
        acc.goalsOwn += cur.awayTeamGoals;

        return acc;
      }, { goalsFavor: 0, goalsOwn: 0 });
    return teamGoals;
  }

  getAway(team: Team, allMatches: ILeaderboard[]) {
    console.log(this);
    const teamGoals = allMatches
      .filter((match) => match.awayTeam.teamName === team.name).reduce((acc, cur) => {
        acc.goalsFavor += cur.awayTeamGoals;
        acc.goalsOwn += cur.homeTeamGoals;

        return acc;
      }, { goalsFavor: 0, goalsOwn: 0 });

    return teamGoals;
  }

  async getGoals(route: Route) {
    const { allMatches } = await this.createdTeams();

    const response = (await this.selectTeam(route)).map((teams) => {
      const team = { ...teams };
      let teamGoals: TeamsGol = { goalsFavor: 0, goalsOwn: 0 };
      if (route === 'home') {
        teamGoals = this.getHome(team, allMatches);
      }
      if (route === 'away') {
        teamGoals = this.getAway(team, allMatches);
      }
      team.goalsFavor = teamGoals.goalsFavor;
      team.goalsOwn = teamGoals.goalsOwn;
      team.goalsBalance += team.goalsFavor - team.goalsOwn;
      team.efficiency += Number(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2));
      return team;
    });
    return response;
  }

  async getLeaderBoardOrder(route: Route) {
    let leaderboardHome: Team[] = [];
    if (route === 'home' || route === 'away') {
      leaderboardHome = await this.getGoals(route);
    } else {
      leaderboardHome = await this.getTotalPoints();
    }

    const orderTeams = leaderboardHome.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });

    return orderTeams;
  }
}
