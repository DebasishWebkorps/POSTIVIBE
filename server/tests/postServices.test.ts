import { createPostService, getAllPostsService, postReactionService } from '../services/postServices';
import prisma from '../models/prismaClient';
import { authenticateUser } from '../services/authenticateUser';

jest.mock('../models/prismaClient');

prisma.$transaction = jest.fn()

jest.mock('../models/prismaClient', () => ({
    post: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
    },
    reaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
    }
}));

const mockUser = {
    status: 200,
    message: 'User authenticated successfully',
    user: { id: 1, role: 'user' }
};

const mockAdmin = {
    status: 200,
    message: 'User authenticated successfully',
    user: { id: 1, role: 'admin' }
};


jest.mock('../services/authenticateUser');

describe('createPostService', () => {
    test('create a post', async () => {

        (authenticateUser as jest.Mock).mockResolvedValue(mockAdmin);
        (prisma.post.create as jest.Mock).mockResolvedValue({
            id: 1,
            title: 'Test Title',
            content: 'Test Content'
        });

        const result = await createPostService('valid token', 'Test Title', 'Test Content');

        expect(result.status).toBe(200);
        expect(result.message).toBe('Post Created');
    });

    test('return error when user is not admin', async () => {

        (authenticateUser as jest.Mock).mockResolvedValue(mockUser);

        const result = await createPostService('valid token', 'Test Title', 'Test Content');

        expect(result.status).toBe(400);
        expect(result.message).toBe('You are not authorized');
    });

    test('error', async () => {
        (authenticateUser as jest.Mock).mockResolvedValue(mockAdmin);
        (prisma.post.create as jest.Mock).mockRejectedValue({ message: 'error' });

        const result = await createPostService('valid token', 'Test Title', 'Test Content');

        expect(result.status).toBe(500);
        expect(result.message).toBe('Something went wrong while creating the post');
    });
});





describe('postReactionService', () => {
    test('react to a post successfully when the post exists', async () => {
        (authenticateUser as jest.Mock).mockResolvedValue(mockUser);
        (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1, title: 'Test Post', likes: 0 });
        (prisma.reaction.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.reaction.create as jest.Mock).mockResolvedValue({});
        (prisma.post.update as jest.Mock).mockResolvedValue({ id: 1, title: 'Test Post', likes: 1 });

        const result = await postReactionService('valid token', 1, 'like');
        expect(result.status).toBe(200);
        expect(result.message).toBe('Post Reacted Successfully');
    });

    test('should return error if the post does not exist', async () => {
        const mockAuthResponse = { status: 200, message: 'User authenticated successfully', user: { id: 1, role: 'user' } };
        (authenticateUser as jest.Mock).mockResolvedValue(mockAuthResponse);
        (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await postReactionService('valid token', 1, 'like');

        expect(result.status).toBe(404);
        expect(result.message).toBe('Post Unavailable or Removed');
    });

    test('should handle errors during reacting to a post', async () => {
        const mockAuthResponse = { status: 200, message: 'User authenticated successfully', user: { id: 1, role: 'user' } };
        (authenticateUser as jest.Mock).mockResolvedValue(mockAuthResponse);
        (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1, title: 'Test Post', likes: 0 });
        (prisma.reaction.findUnique as jest.Mock).mockRejectedValue('error');

        const result = await postReactionService('valid token', 1, 'like');

        expect(result.status).toBe(500);
        expect(result.message).toBe('Something went wrong while reacting to the post');
    });
});




describe('getAllPostsService', () => {
    test('return all posts', async () => {
        (authenticateUser as jest.Mock).mockResolvedValue(mockUser);
        (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: 1, title: 'Test Post', content: 'Content', _count: { reactedBy: 3 } }]);

        const result = await getAllPostsService('valid token');

        expect(result.status).toBe(200);
        expect(result.message).toBe('All Posts');
        expect(result.posts).toHaveLength(1);
        expect(result.posts[0].likedBy).toBe(3);
    });

    test('error', async () => {
        (authenticateUser as jest.Mock).mockResolvedValue(mockUser);
        (prisma.post.findMany as jest.Mock).mockRejectedValue('error');

        const result = await getAllPostsService('valid token');

        expect(result.status).toBe(500);
        expect(result.message).toBe('Something went wrong while fetching posts');
    });
});
