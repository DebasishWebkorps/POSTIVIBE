import { Router } from 'express';
import { postAddPost, postReaction, getAllPosts } from '../controllers/postController';

const router = Router();

router.post('/add', postAddPost);
router.post('/reaction', postReaction);
router.get('/', getAllPosts);

export default router;
