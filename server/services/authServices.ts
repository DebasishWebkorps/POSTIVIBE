import prisma from '../models/prismaClient';
import { decodeJwt } from '../utils/jwtUtils';

export const loginUserService = async (credential: string) => {

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

    if (email === 'debasish@webkorps.com') {

        await prisma.user.create({
            data: {
                email,
                name,
                image: picture,
                role: 'admin'
            },
        });

    } else {

        await prisma.user.create({
            data: {
                email,
                name,
                image: picture,
            },
        });

    }

    return { status: 200, message: 'Login Successful' };
};
