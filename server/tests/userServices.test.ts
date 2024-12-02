import { getMyReactionsService } from '../services/userServices'
import prisma from '../models/prismaClient';
import { authenticateUser } from '../services/authenticateUser'

jest.mock('../models/prismaClient', () => ({
    reaction: {
        findMany: jest.fn(),
    },
}));

jest.mock('../services/authenticateUser', () => ({
    authenticateUser: jest.fn(),
}));


beforeEach(() => {
    jest.clearAllMocks();
});

test('authentication successful', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
        status: 200,
        message: 'User authenticated successfully',
        user: {
            id: 2,
            email: 'debasish@webkorps.com',
            role: 'user'
        }
    });

    (prisma.reaction.findMany as jest.Mock).mockResolvedValue([
        { postId: 1, type: 'like' },
        { postId: 2, type: 'dislike' },
    ]
    );

    const result = await getMyReactionsService('valid token') as
        { status: number; message: string; posts: { postId: number; reaction: string }[] };

    expect(result.status).toBe(200);
    expect(result.message).toBe('posts with reactions retrieved successfully');
    expect(result.posts).toHaveLength(2);
    expect(result.posts[0].postId).toBe(1);
    expect(result.posts[0].reaction).toBe('like');
});

test('authentication fails', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
        status: 400,
        message: 'Invalid Credentials',
        user: null
    });

    const result = await getMyReactionsService('invalid token');

    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid Credentials');
});

test('invalid user', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
        status: 200,
        message: 'User authenticated successfully',
        user: { id: null, email: 'user@example.com', role: 'user' }
    });

    const result = await getMyReactionsService('valid token');

    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid User');
});

test('error', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
        status: 200,
        message: 'User authenticated successfully',
        user: { id: 1, email: 'user@example.com', role: 'user' }
    });

    (prisma.reaction.findMany as jest.Mock).mockRejectedValue('error');

    const result = await getMyReactionsService('valid token');

    expect(result.status).toBe(500);
    expect(result.message).toBe('some error occured');
});
