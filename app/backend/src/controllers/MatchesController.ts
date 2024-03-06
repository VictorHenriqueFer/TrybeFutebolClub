import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatcheController {
  constructor(
    private matchesService = new MatchesService(),
  ) { }

  public async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const progress = inProgress === 'true';
      const { status, data } = await this.matchesService.getFilterMatches(progress);
      return res.status(mapStatusHTTP(status)).json(data);
    }

    const { status, data } = await this.matchesService.getAllMatches();
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatches(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.matchesService.finishedMatches(Number(id));
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async uptadeResultMatches(req: Request, res: Response) {
    const { id } = req.params;
    const result = req.body;

    const { status, data } = await this.matchesService.updateResultadoMatches(Number(id), result);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async createdMatches(req: Request, res: Response) {
    const { status, data } = await this.matchesService.createdMatches(req.body);

    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getLeaderboardHome(req: Request, res: Response) {
    const { status, data } = await this.matchesService
      .getLeaderboardHome(req.route.path.split('/')[1]);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
