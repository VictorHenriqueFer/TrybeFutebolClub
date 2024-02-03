import { Request, Router, Response } from 'express';
import UserController from '../controllers/UsersController';

const usersController = new UserController();

const router = Router();

router.post('/', (req: Request, res:Response) => usersController.login(req, res));
router.get('/', (req:Request, res: Response) => usersController.allUser(req, res));

export default router;
