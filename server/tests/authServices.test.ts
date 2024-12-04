import prisma from '../models/prismaClient';
import { loginUserService } from '../services/authServices';
import { decodeJwt } from '../utils/jwtUtils';

jest.mock('../utils/jwtUtils');

jest.mock('../models/prismaClient', () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
}));

describe('loginUserService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 when the token is invalid', async () => {
        (decodeJwt as jest.Mock).mockReturnValue(null);

        const result = await loginUserService('invalid token');

        expect(result.status).toBe(400);
        expect(result.message).toBe('Invalid token');
    });

    test('should return 200 when the user already exists', async () => {
        const mockDecoded = {
            email: 'debasish@webkorps.com',
        };

        (decodeJwt as jest.Mock).mockReturnValue(mockDecoded);
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'debasish@webkorps.com',
            name: 'Debasish Kisan',
            image: 'imageurl',
            role: 'admin',
        });

        const result = await loginUserService('valid token');

        expect(result.status).toBe(200);
        expect(result.message).toBe('Login Successful');
        expect(prisma.user.create).not.toHaveBeenCalled();
    });

    test('create a new user', async () => {
        const mockDecoded = {
            email: 'demo@demo.com',
            name: 'demo demo',
            picture: 'imageurl',
        };

        (decodeJwt as jest.Mock).mockReturnValue(mockDecoded);
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await loginUserService('valid token');

        expect(result.status).toBe(200);
        expect(result.message).toBe('Login Successful');

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                email: 'demo@demo.com',
                name: 'demo demo',
                image: 'imageurl',
            },
        });
    });

    test('create a new user with an "admin" role if email is "debasish@webkorps.com"', async () => {
        const mockDecoded = {
            name: 'Debasish Kisan',
            email: 'debasish@webkorps.com',
            picture: 'imageurl',
        };

        (decodeJwt as jest.Mock).mockReturnValue(mockDecoded);
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await loginUserService('valid token');

        expect(result.status).toBe(200);
        expect(result.message).toBe('Login Successful');

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                email: 'debasish@webkorps.com',
                name: 'Debasish Kisan',
                image: 'imageurl',
                role: 'admin',
            },
        });
    });

});
