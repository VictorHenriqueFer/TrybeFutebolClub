import { Request, Response, Router } from 'express';
import MatcheController from '../controllers/MatchesController';
import validation from '../middlewares/Validations';
import validationsMath from '../middlewares/ValidationsMatches';

const matchesController = new MatcheController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchesController.getMatches(req, res));

router.post(
  '/',
  validation.auth,
  validationsMath.validateMatche,
  (req: Request, res: Response) => matchesController.createdMatches(req, res),
);

router.patch(
  '/:id/finish',
  validation.auth,
  (req: Request, res: Response) => matchesController.updateMatches(req, res),
);

router.patch(
  '/:id',
  validation.auth,
  (req: Request, res: Response) => matchesController.uptadeResultMatches(req, res),
);

export default router;
