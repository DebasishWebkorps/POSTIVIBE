import prisma from '../models/prismaClient';
import { decodeJwt } from '../utils/jwtUtils';
import { authenticateUser } from './authenticateUser';

export const createPostService = async (credential: string, title: string, content: string) => {

    const userAuthResult = await authenticateUser(credential);

    if (userAuthResult.status !== 200) {
        return userAuthResult;
    }

    const { user } = userAuthResult;

    if (!user?.id) {
        return { status: 400, message: 'Invalid User' };
    }

    if (user.role !== 'admin') {
        return { status: 400, message: 'You are not authorized' };
    }

    await prisma.post.create({
        data: {
            title,
            content,
            userId: user.id
        },
    });

    return { status: 200, message: 'Post Created' };
};

export const postReactionService = async (credential: string, postid: number, reaction: string) => {

    const userAuthResult = await authenticateUser(credential);

    if (userAuthResult.status !== 200) {
        return userAuthResult;
    }

    const { user } = userAuthResult;

    if (!user?.id) {
        return { status: 400, message: 'Invalid User' };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: postid
        }
    })

    if (!existingPost) {
        return { status: 404, message: 'Post Unavailable or Removed' }
    }

    const existingReaction = await prisma.reaction.findUnique({
        where: {
            userId_postId: {
                userId: user.id,
                postId: existingPost.id,
            },
        },
    });

    if (existingReaction) {
        return { status: 400, message: 'You have already reacted to this post' };
    }

    if (reaction === 'dislike' && existingPost.likes < 1) {
        return { status: 400, message: 'You cannot dislike this post ' }
    }

    await prisma.$transaction(async (prisma) => {

        await prisma.reaction.create({
            data: {
                userId: user.id,
                postId: existingPost.id,
                type: reaction,
            },
        });

        await prisma.post.update({
            where: {
                id: existingPost.id,
            },
            data: {
                likes: reaction === 'like' ? (existingPost.likes + 1) : (existingPost.likes - 1),
            },
        });

    });


    return { status: 200, message: 'Post Reacted Successfully' };
};

export const getAllPostsService = async (credential: string) => {

    await authenticateUser(credential);

    const allPosts = await prisma.post.findMany({
        include: {
            _count: {
                select: {
                    reactedBy: true
                },
            },
        },
    });

    const posts = allPosts.map(post => ({
        // id: post.id,
        // title: post.title,
        ...post,
        likedBy: post._count.reactedBy,
    }));

    return { status: 200, message: 'All Posts', posts };
};
