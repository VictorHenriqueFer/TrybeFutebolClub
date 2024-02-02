import { Request, Router, Response } from 'express';
import TeamsController from '../controllers/TeamsController';

const teamsControler = new TeamsController();

const router = Router();

router.get('/', (req: Request, res:Response) => teamsControler.getAllTeams(req, res));
router.get('/:id', (req: Request, res: Response) => teamsControler.getTeamsById(req, res));

export default router;
