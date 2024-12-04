import { Request, Response } from 'express';
import { loginUserService } from '../services/authServices';

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { credential } = req.body;
        const result = await loginUserService(credential);
        res.status(result.status).json({ message: result.message });
        return
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred' });
        return
    }
};
