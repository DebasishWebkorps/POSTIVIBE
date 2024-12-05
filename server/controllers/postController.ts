import { Request, Response } from 'express';
import { createPostService, getAllPostsService, postReactionService } from '../services/postServices';
import { io } from '../app';


export const postAddPost = async (req: Request, res: Response) => {
    try {
        const { credential, title, content } = req.body;
        const result = await createPostService(credential, title, content);

        io.emit('post added', result)

        res.status(result.status).json({ message: result.message, result });
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

        io.emit('post Reaction', {
            id: postid,
            reaction,
            result
        })
        res.status(200).json({ message: 'Reaction added successfully' })
        return
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const credential = req.headers.authorization?.split(' ')[1];
        const result = await getAllPostsService(credential);
        res.status(result.status).json(result);
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};
