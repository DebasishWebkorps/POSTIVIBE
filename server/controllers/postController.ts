import { Request, Response } from 'express';
import { createPostService, getAllPostsService, getMostLikedPostsService, postReactionService } from '../services/postServices';
import { io } from '../app';
import cloudinaryUpload from '../utils/cloudinaryUpload';


export const postAddPost = async (req: any, res: Response) => {
    try {
        const { title, content } = req.body;
        const credential = req.headers.authorization?.split(' ')[1];

        const cloudinaryResult = await cloudinaryUpload(req.file)

        const result = await createPostService(credential, title, content, cloudinaryResult.secure_url);

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
        const { postid, reaction } = req.body;
        const credential = req.headers.authorization?.split(' ')[1];
        const result = await postReactionService(credential, postid, reaction);

        io.emit('post Reaction', {
            id: postid,
            reaction,
            result
        })
        res.status(200).json({ message: 'Reaction added successfully' })
        return
    } catch (error: any) {
        console.log('post reaction error', error.message)
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {

        const credential = req.headers.authorization?.split(' ')[1];

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getAllPostsService(credential, page, limit);

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
    }
};


export const getMostLikedPosts = async (req: Request, res: Response) => {
    try {
        const credential = req.headers.authorization?.split(' ')[1];
        const result = await getMostLikedPostsService(credential);
        res.status(result.status).json(result);
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};
