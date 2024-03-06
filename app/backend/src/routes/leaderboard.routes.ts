import { Request, Response, Router } from 'express';
import MatcheController from '../controllers/MatchesController';

const matchesController = new MatcheController();

const router = Router();

router.get('/home', async (req: Request, res: Response) =>
  matchesController.getLeaderboardHome(req, res));
router.get('/away', async (req: Request, res: Response) =>
  matchesController.getLeaderboardHome(req, res));

export default router;
