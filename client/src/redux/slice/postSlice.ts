import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    userReaction: string;
}

interface PostState {
    posts: Post[];
}

const initialState: PostState = {
    posts: [],
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost(state, action: PayloadAction<Post>) {
            state.posts.push(action.payload);
        },
        setPosts(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        },
        reactToPost(state, action: PayloadAction<{ id: number; reaction: string, result: object }>) {
            const { id, reaction } = action.payload;
            const post = state.posts.find(post => post.id === id);

            if (post) {
                if (reaction === "like") {
                    post.likes += 1;
                } else if (reaction === "dislike") {
                    post.likes -= 1;
                }
            }

            state.posts = state.posts.sort((a, b) => b.likes - a.likes);
        },
        addOwnReaction(state, action: PayloadAction<{ id: number; reaction: string, result: object }>) {
            const { id, reaction } = action.payload;
            const post = state.posts.find(post => post.id === id);

            if (post) {
                if (reaction === "like") {
                    post.userReaction = 'like';
                } else if (reaction === "dislike") {
                    post.userReaction = 'dislike';
                }
            }

        }
    },
});

export const { addPost, setPosts, reactToPost, addOwnReaction } = postSlice.actions;
export default postSlice.reducer;
