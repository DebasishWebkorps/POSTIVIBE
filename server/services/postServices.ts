import prisma from '../models/prismaClient';
import { authenticateUser } from './authenticateUser';

export const createPostService = async (credential: string, title: string, content: string) => {

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
                userId: user.id
            },
        });

        const { userId, ...filteredPost } = post;
        (filteredPost as { id: number; title: string; content: string; likes: number; name: string }).name = user.name;

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

                }else if (existingReaction.type === 'dislike' && reaction === 'like') {
                 
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
                }
            }

            return { status: 200, message: 'Post Reacted Successfully', name: user.name };
        });

        return result;

    } catch (error: any) {
        return { status: 500, message: 'Something went wrong while reacting to the post' };
    }
};


export const getAllPostsService = async (credential: string) => {

    try {

        const { user } = await authenticateUser(credential);

        const allPosts = await prisma.post.findMany({
            orderBy: {
                likes: 'desc'
            },
            include: {
                _count: {
                    select: {
                        reactedBy: true
                    },
                },
                reactedBy: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        type: true
                    }
                }
            },
        });

        const posts = allPosts.map(post => {
            const userReaction = post.reactedBy.length > 0 ? post.reactedBy[0].type : null;

            return {
                id: post.id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                userReaction,
                reactionCount: post._count.reactedBy,
            };
        });

        return { status: 200, message: 'All Posts', posts };
    } catch (error: any) {
        return { status: 500, message: 'Something went wrong while fetching posts' };
    }
};