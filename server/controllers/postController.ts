import { Request, Response } from 'express';
import { createPostService, getAllPostsService, postReactionService } from '../services/postServices';

export const postAddPost = async (req: Request, res: Response) => {
    try {
        const { credential, title, content } = req.body;
        const result = await createPostService(credential, title, content);
        res.status(result.status).json({ message: result.message });
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};

export const postReaction = async (req: Request, res: Response) => {
    try {
        const { credential, postid, reaction } = req.body;
        const result = await postReactionService(credential, postid, reaction);
        res.status(result.status).json({ message: result.message });
        return
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { credential } = req.body;
        const result = await getAllPostsService(credential);
        res.status(result.status).json(result);
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};
