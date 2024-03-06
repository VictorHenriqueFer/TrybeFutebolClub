import { Router } from 'express';
import matchRouter from './matches.routes';
import teamsRouter from './teams.routes';
import usersRouter from './users.routes';
import leaderboardRouter from './leaderboard.routes';

const router = Router();

router.use('/teams', teamsRouter);

router.use('/login', usersRouter);

router.use('/matches', matchRouter);

router.use('/leaderboard', leaderboardRouter);

export default router;
