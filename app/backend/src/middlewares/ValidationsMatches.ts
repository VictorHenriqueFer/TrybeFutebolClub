import { NextFunction, Request, Response } from 'express';

export default class Validations {
  static validateMatche(req: Request, res: Response, next: NextFunction): Response | void {
    const matche = req.body;
    const requireKeys = [
      'homeTeamGoals', 'homeTeamId', 'awayTeamGoals', 'awayTeamId'];
    const notFoundKey = requireKeys.find((key) => !(key in matche));
    if (notFoundKey) {
      return res.status(400).json({ message: `${notFoundKey} is required` });
    }
    if (matche.homeTeamId === matche.awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    next();
  }
}
