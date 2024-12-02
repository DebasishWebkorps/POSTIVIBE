import { Response } from 'express';
import prisma from '../models/prismaClient';
import { decodeJwt } from '../utils/jwtUtils';
import { authenticateUser } from './authenticateUser';

export const getMyReactionsService = async (credential: string) => {

    try{

        const userAuthResult = await authenticateUser(credential);
        
        if (userAuthResult.status !== 200) {
            return userAuthResult;
        }
        
        const { user } = userAuthResult;
        
        if (!user?.id) {
            return { status: 400, message: 'Invalid User' };
        }
        
        const likedPosts = await prisma.reaction.findMany({
            where: {
                userId: user.id
            }
        });
        
        
        const posts = likedPosts.map(reaction => ({
            postId: reaction.postId,
            reaction: reaction.type,
        }));
        
        return { status: 200, message: 'posts with reactions retrieved successfully', posts };
    }catch(error){
        return { status: 500, message: 'some error occured' };

    }
};
