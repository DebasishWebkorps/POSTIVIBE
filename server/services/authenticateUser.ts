import prisma from "../models/prismaClient";
import { decodeJwt } from "../utils/jwtUtils";

export const authenticateUser = async (credential: string) => {
    try {
        if (!credential) {
            return { status: 400, message: 'Missing credentials' };
        }

        const decoded = decodeJwt(credential);

        if (!decoded) {
            return { status: 400, message: 'Invalid Credentials' };
        }

        const { email } = decoded;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return { status: 404, message: 'You have to create an account first' };
        }

        return { status: 200, message: 'User authenticated successfully', user };

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong' };
    }
};


export const authenticateUserAndSendStats = async (credential: string) => {
    try {
        if (!credential) {
            return { status: 400, message: 'Missing credentials' };
        }

        const decoded = decodeJwt(credential);

        if (!decoded) {
            return { status: 400, message: 'Invalid Credentials' };
        }

        const { email } = decoded;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
                name: true,
                image: true,
                _count: {
                    select: {
                        post: true, 
                    },
                },
                reaction: true,
            },
        });

        if (!user) {
            return { status: 404, message: 'You have to create an account first' };
        }


        const totalLikes = user.reaction.filter(r => r.type === 'like').length;
        const totalDislikes = user.reaction.filter(r => r.type === 'dislike').length;

        return {
            status: 200,
            message: 'User authenticated successfully',
            user: {
                name:user.name,
                image:user.image,
                totalPost: user._count.post,
                totalLikes,
                totalDislikes,
            }
        };

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong' };
    }
};
