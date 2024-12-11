import prisma from '../models/prismaClient';
import { decodeJwt } from '../utils/jwtUtils';

export const loginUserService = async (credential: string) => {

    try {
        const decoded = decodeJwt(credential);

        if (!decoded) {
            return { status: 400, message: 'Invalid token' };
        }

        const { name, email, picture } = decoded;

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return { status: 200, message: 'Login Successful' };
        }

        const userData = {
            email,
            name,
            image: picture,
            role: email === 'debasish@webkorps.com' ? 'admin' : 'user'
        }


        await prisma.user.create({
            data: userData
        });


        return { status: 200, message: 'Login Successful' };

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong' };
    }
};
