import { authenticateUser } from "../services/authenticateUser";
import { decodeJwt } from '../utils/jwtUtils';
import prisma from '../models/prismaClient'


jest.mock('../models/prismaClient', () => ({
    user: {
        findUnique: jest.fn(),
    },
}));


jest.mock('../utils/jwtUtils', () => ({
    decodeJwt: jest.fn()
}));


test('should return missing credentials', async () => {
    const result = await authenticateUser('');
    expect(result.status).toBe(400);
    expect(result.message).toBe('Missing credentials');
});


test('should return JWT decode fails', async () => {
    (decodeJwt as jest.Mock).mockReturnValue(null);

    const result = await authenticateUser('invalid token');
    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid Credentials');
});


test('should return user not found', async () => {
    (decodeJwt as jest.Mock).mockReturnValue({
        email: 'demo@demo.com'
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await authenticateUser('newuser invalid token');
    expect(result.status).toBe(404);
    expect(result.message).toBe('You have to create an account first');
});


test('authenticate user successfully', async () => {
    (decodeJwt as jest.Mock).mockReturnValue({
        email: 'debasish@webkorps.com'
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        email: 'debasish@webkorps.com',
        name: 'Debasish Kisan',
        image: 'imageurl',
        role: 'user'
    });

    const result = await authenticateUser('valid token');
    
    expect(result.status).toBe(200);
    expect(result.message).toBe('User authenticated successfully');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('debasish@webkorps.com');
    expect(result.user.role).toBe('user');
});


test('should return error', async () => {
    (decodeJwt as jest.Mock).mockReturnValue({ email: 'debasish@webkorps.com' });

    (prisma.user.findUnique as jest.Mock).mockRejectedValue('error');

    const response = await authenticateUser('validtoken')

    expect(response.status).toBe(500);
    expect(response.message).toBe('Something went wrong');
});