import { Request, Response } from 'express';
import { getMyReactionsService } from '../services/userServices';


export const getMyReactions = async (req: Request, res: Response) => {
    try {
        const { credential } = req.body;
        const result = await getMyReactionsService(credential);
        res.status(result.status).json(result);
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};
