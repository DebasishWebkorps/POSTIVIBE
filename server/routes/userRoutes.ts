import { Router } from 'express';
import { getMyReactions } from '../controllers/userController';
import { authenticateUser } from '../services/authenticateUser';

const router = Router();

router.get('/myreaction', getMyReactions);

export default router;
