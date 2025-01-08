import { io } from '../app';
import prisma from '../models/prismaClient';
import { authenticateUser } from './authenticateUser';

export const createPostService = async (credential: string, title: string, content: string, image: string) => {

    try {

        const userAuthResult = await authenticateUser(credential);

        if (userAuthResult.status !== 200) {
            return userAuthResult;
        }

        const { user } = userAuthResult;

        if (!user?.id) {
            return { status: 400, message: 'Invalid User' };
        }


        const post = await prisma.post.create({
            data: {
                title,
                content,
                image,
                userId: user.id
            },
        });

        const { userId, ...filteredPost } = post;
        (filteredPost as { id: number; title: string; content: string; image: string; likes: number; userName: string }).userName = user.name;
        (filteredPost as { id: number; title: string; content: string; image: string; likes: number; userName: string, userImage: string }).userImage = user.image;

        return { status: 200, message: 'Post Created', filteredPost };

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong while creating the post' };
    }
};

export const postReactionService = async (credential: string, postid: number, reaction: string) => {
    try {
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
        });

        if (!existingPost) {
            return { status: 404, message: 'Post Unavailable or Removed' };
        }

        const existingReaction = await prisma.reaction.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: existingPost.id,
                },
            },
        });

        let reactions = {
            like: 0,
            dislike: 0
        }

        const result = await prisma.$transaction(async (prisma) => {
            if (existingReaction) {

                if (existingReaction.type === reaction) {
                    return { status: 400, message: 'You have already reacted with this reaction' };
                }

                if (existingReaction.type === 'like' && reaction === 'dislike') {

                    await prisma.reaction.update({
                        where: {
                            userId_postId: {
                                userId: user.id,
                                postId: existingPost.id,
                            },
                        },
                        data: {
                            type: reaction,
                        },
                    });

                    await prisma.post.update({
                        where: {
                            id: existingPost.id,
                        },
                        data: {
                            likes: existingPost.likes - 1,
                        },
                    });

                    reactions.like -= 1
                    reactions.dislike += 1

                } else if (existingReaction.type === 'dislike' && reaction === 'like') {

                    await prisma.reaction.update({
                        where: {
                            userId_postId: {
                                userId: user.id,
                                postId: existingPost.id,
                            },
                        },
                        data: {
                            type: reaction,
                        },
                    });

                    await prisma.post.update({
                        where: {
                            id: existingPost.id,
                        },
                        data: {
                            likes: existingPost.likes + 1,
                        },
                    });

                    reactions.like += 1
                    reactions.dislike -= 1

                } else if (reaction === 'like') {

                    await prisma.reaction.update({
                        where: {
                            userId_postId: {
                                userId: user.id,
                                postId: existingPost.id,
                            },
                        },
                        data: {
                            type: reaction,
                        },
                    });

                    await prisma.post.update({
                        where: {
                            id: existingPost.id,
                        },
                        data: {
                            likes: existingPost.likes + 1,
                        },
                    });

                    reactions.like += 1
                    reactions.dislike = 0
                }

            } else {
                if (reaction === 'dislike' && existingPost.likes < 1) {
                    return { status: 400, message: 'You cannot dislike this post as there are no likes yet.' };
                }

                await prisma.reaction.create({
                    data: {
                        userId: user.id,
                        postId: existingPost.id,
                        type: reaction,
                    },
                });

                if (reaction === 'like') {
                    await prisma.post.update({
                        where: {
                            id: existingPost.id,
                        },
                        data: {
                            likes: existingPost.likes + 1,
                        },
                    });
                    reactions.like += 1
                } else {

                    reactions.dislike -= 1
                }

            }

            
            return { status: 200, message: 'Post Reacted Successfully', name: user.name, reactions };
        });
        
        return result;

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong while reacting to the post' };
    }
};


export const getAllPostsService = async (credential: string, page: number, limit: number) => {
    try {

        const { user, status, message } = await authenticateUser(credential);

        if (status !== 200) {
            return { status, message };
        }

        const offset = (page - 1) * limit;

        const allPosts = await prisma.post.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                { likes: 'desc' },
                { id: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        reactedBy: true,
                    },
                },
                reactedBy: {
                    where: {
                        userId: user.id,
                    },
                    select: {
                        type: true,
                    },
                },
            },
        });


        const posts = allPosts.map(post => {
            const userReaction = post.reactedBy.length > 0 ? post.reactedBy[0].type : null;

            return {
                id: post.id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                image: post.image,
                userReaction,
                reactionCount: post._count.reactedBy,
                userName: post.user.name,
                userImage: post.user.image,
            };
        });

        const totalPosts = await prisma.post.count();

        return {
            status: 200,
            message: 'All Posts',
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
        };
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return { status: 500, message: 'Something went wrong while fetching posts' };
    }
};


export const getMostLikedPostsService = async (credential: string) => {

    try {

        await authenticateUser(credential);

        const mostLikedPosts = await prisma.post.findMany({
            orderBy: {
                likes: 'desc'
            },
            where: {
                likes: {
                    gte: 1
                }
            },
            take: 5,
            select: {
                id: true,
                title: true,
                image: true,
            }
        });

        return { status: 200, message: 'Most Liked Posts', mostLikedPosts };
    } catch (error: any) {
        return { status: 500, message: 'Something went wrong while fetching posts' };
    }
};