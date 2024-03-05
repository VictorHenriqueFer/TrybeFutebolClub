import { ServiceMessage, ServiceResponse } from '../../utils/ServiceResponse';
import { ILeaderboardHome, IMatches, IMatchesResult } from './IMatches';

export interface IMatchesModel {
  findAll(): Promise<IMatches[]>,
  getMathfilter(progress: boolean): Promise<IMatches[]>,
  updateMatches(id: number): Promise<ServiceMessage>,
  updateResultadoMatches(id:number, result: IMatchesResult): Promise<IMatches | void>,
  createdMatches(data: Partial<IMatches>): Promise<ServiceResponse<IMatches>>,
  getGoals(): Promise<ILeaderboardHome[]>
  getLeaderBoardOrder(): Promise<ILeaderboardHome[]>
}
