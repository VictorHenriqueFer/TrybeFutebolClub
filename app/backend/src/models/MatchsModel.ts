import { Team, TeamsGol } from '../utils/types';
import { ServiceMessage, ServiceResponse } from '../utils/ServiceResponse';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { ILeaderboard, IMatches, IMatchesResult } from '../Interfaces/matches/IMatches';
import { IMatchesModel } from '../Interfaces/matches/IMatchesModel';

export default class MatchesModel implements IMatchesModel {
  private model = SequelizeMatches;
  private teamModel = SequelizeTeams;

  async findAll(): Promise<IMatches[]> {
    const dbData = await this.model.findAll({
      include: [
        {
          model: SequelizeTeams,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: SequelizeTeams,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
      attributes: { exclude: ['home_team_id', 'away_team_id'] },
    });
    return dbData;
  }

  async getMathfilter(progress: boolean): Promise<IMatches[]> {
    const dbData = await this.model.findAll({
      where: { inProgress: progress },
      include: [
        {
          model: SequelizeTeams,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: SequelizeTeams,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
      attributes: { exclude: ['home_team_id', 'away_team_id'] },
    });
    return dbData;
  }

  async updateMatches(id: number): Promise<ServiceMessage> {
    const dbData = await this.model.findByPk(id);

    if (dbData) {
      await this.model.update({ inProgress: false }, { where: { id } });
      return { message: 'Finished' };
    }

    return { message: 'error' };
  }

  async updateResultadoMatches(id: number, result: IMatchesResult): Promise<IMatches | void> {
    const dbData = await this.model.findByPk(id);
    const { homeTeamGoals, awayTeamGoals } = result;

    if (dbData) {
      await this.model
        .update(
          { homeTeamGoals, awayTeamGoals },
          { where: { id } },
        );
      return dbData;
    }
  }

  async createdMatches(data: IMatches): Promise<ServiceResponse<IMatches>> {
    const { homeTeamGoals, homeTeamId, awayTeamGoals, awayTeamId } = data;

    const team1 = await this.model.findOne({ where: { homeTeamId } });
    const team2 = await this.model.findOne({ where: { awayTeamId } });

    if (!team1 || !team2) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }

    const newMatch = await this.model.create({
      homeTeamGoals, homeTeamId, awayTeamGoals, awayTeamId, inProgress: true });

    return { status: 'CREATED', data: newMatch };
  }

  async createdTeams() {
    const teams = await this.teamModel.findAll({ attributes: { exclude: ['id'] } });

    const allMatches = await this.getMathfilter(false) as (SequelizeMatches & {
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

  selectTeam = async (route: 'home' | 'away') => {
    if (route === 'home') {
      return this.getPointsHome();
    }
    return this.getPointsAway();
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

    console.log(teamGoals);
    return teamGoals;
  }

  async getGoals(route: 'home' | 'away') {
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

  async getLeaderBoardOrder(route: 'home' | 'away') {
    const leaderboardHome = await this.getGoals(route);

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
