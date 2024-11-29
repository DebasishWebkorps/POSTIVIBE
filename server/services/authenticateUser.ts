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
        console.log(error.message)
        return { status: 500, message: 'Something went wrong' };
    }
};
