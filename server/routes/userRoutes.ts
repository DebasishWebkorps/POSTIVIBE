import { Router } from 'express';
import { getMyReactions, getVerified } from '../controllers/userController';
import { authenticateUser } from '../services/authenticateUser';

const router = Router();

router.get('/myreaction', getMyReactions);
router.get('/verify', getVerified)

export default router;
