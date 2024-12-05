import { Request, Response } from 'express';
import { getMyReactionsService } from '../services/userServices';
import { authenticateUser } from '../services/authenticateUser';


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

export const getVerified = async (req: Request, res: Response) =>{
    try {
        const credential = req.headers.authorization?.split(' ')[1];
        const result = await authenticateUser(credential);
        res.status(result.status).json(result);
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
}
