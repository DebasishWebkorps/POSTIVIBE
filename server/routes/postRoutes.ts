import { Router } from 'express';
import { postAddPost, postReaction, getAllPosts, getMostLikedPosts } from '../controllers/postController';
import multerMiddleware from '../middleware/multerMiddleware';

const router = Router();

router.post('/add', multerMiddleware, postAddPost);
router.post('/reaction', postReaction);
router.get('/mostlikedposts', getMostLikedPosts);
router.get('/', getAllPosts);

export default router;
