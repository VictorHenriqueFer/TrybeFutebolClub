import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchsModel';
import { ServiceMessage, ServiceResponse } from '../utils/ServiceResponse';
import { IMatches, IMatchesResult } from '../Interfaces/matches/IMatches';
import { IMatchesModel } from '../Interfaces/matches/IMatchesModel';
import { NewEntity } from '../Interfaces';

export default class MatchesService {
  constructor(
    private matchesModel: IMatchesModel = new MatchesModel(),
    private teamsModel: TeamsModel = new TeamsModel(),
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatches[]>> {
    const AllMatches = await this.matchesModel.findAll();
    return { status: 'SUCCESSFUL', data: AllMatches };
  }

  public async getFilterMatches(progress: boolean): Promise<ServiceResponse<IMatches[]>> {
    const filterMatches = await this.matchesModel.getMathfilter(progress);

    return { status: 'SUCCESSFUL', data: filterMatches };
  }

  public async finishedMatches(id: number): Promise<ServiceResponse<ServiceMessage>> {
    const updateMatches = await this.matchesModel.updateMatches(id);

    return { status: 'SUCCESSFUL', data: updateMatches };
  }

  public async updateResultadoMatches(
    id: number,
    result: IMatchesResult,
  ): Promise<ServiceResponse<IMatches | ServiceMessage>> {
    const updateResult = await this.matchesModel.updateResultadoMatches(id, result);

    if (!updateResult) {
      return { status: 'INVALID_DATA', data: { message: 'Error' } };
    }

    return { status: 'SUCCESSFUL', data: updateResult };
  }

  public async createdMatches(matche: NewEntity<IMatches>): Promise<ServiceResponse<IMatches>> {
    const allMatches = await this.matchesModel.findAll();
    if (this.teamsModel.findById(matche.homeTeamId) === undefined
     || this.teamsModel.findById(matche.awayTeamId) === undefined) {
      return { status: 'INVALID_DATA', data: { message: 'There is no team with such id!' } };
    }
    const matcheExist = allMatches.find((match) => match.homeTeamId === matche.homeTeamId
      && match.awayTeamId === matche.awayTeamId);
    if (matcheExist && matcheExist.inProgress) {
      return { status: 'INVALID_DATA', data: { message: 'Match already in progress' } };
    }

    const newMatche = await this.matchesModel.createdMatches(matche);

    return newMatche;
  }

  public async getLeaderboardHome() {
    const leaderboardHome = await this.matchesModel.getLeaderBoardOrder();

    return { status: 'SUCCESSFUL', data: leaderboardHome };
  }
}
