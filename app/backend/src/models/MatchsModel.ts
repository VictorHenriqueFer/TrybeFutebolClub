import { ServiceMessage, ServiceResponse } from '../utils/ServiceResponse';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { IMatches, IMatchesResult } from '../Interfaces/matches/IMatches';
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
}
