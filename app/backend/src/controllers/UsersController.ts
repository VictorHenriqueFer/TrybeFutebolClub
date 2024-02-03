import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import UsersService from '../services/UsersService';

export default class UserController {
  constructor(
    private usersService = new UsersService(),
  ) {}

  public async allUser(_req: Request, res: Response) {
    const serviceResponse = await this.usersService.findAllUser();
    res.status(200).json(serviceResponse.data);
  }

  public async login(req: Request, res: Response) {
    const serviceResponse = await this.usersService.login(req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }
}
