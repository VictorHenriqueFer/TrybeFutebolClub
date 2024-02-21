import { Request, Router, Response } from 'express';
import UserController from '../controllers/UsersController';
import validation from '../middlewares/Validations';

const usersController = new UserController();

const router = Router();

router.post(
  '/',
  validation.validateLogin,
  (req: Request, res:Response) => usersController.login(req, res),
);
router.get(
  '/role',
  validation.auth,
  (req:Request, res: Response) => usersController.getRole(req, res),
);

export default router;
