import { ITeamsModel } from '../Interfaces/teams/ITeamsModel';
import { ITeams } from '../Interfaces/teams/ITeams';
import { ServiceResponse } from '../utils/ServiceResponse';
import TeamsModel from '../models/TeamsModel';

export default class TeamsService {
  constructor(private teamsModel: ITeamsModel = new TeamsModel()) {}

  public async getAllTeams(): Promise<ServiceResponse<ITeams[]>> {
    const allTeams = await this.teamsModel.findAll();
    return { status: 'SUCCESSFUL', data: allTeams };
  }

  public async getTeamsById(id:number):Promise<ServiceResponse<ITeams>> {
    const byIdTeams = await this.teamsModel.findById(id);
    if (!byIdTeams) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };
    return { status: 'SUCCESSFUL', data: byIdTeams };
  }
}
