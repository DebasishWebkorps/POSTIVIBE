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
    from: number,
    to: number
}

const initialState: PostState = {
    posts: [],
    from: null,
    to: null
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
        reactToPost(state, action: PayloadAction<{ id: number; reaction: string; result: object }>) {
            const { id, reaction } = action.payload;
            const postIndex = state.posts.findIndex(post => post.id === id);

            if (postIndex !== -1) {
                const updatedPost = { ...state.posts[postIndex] };

                if (reaction === "like") {
                    updatedPost.likes += 1;
                } else if (reaction === "dislike") {
                    updatedPost.likes -= 1;
                }

                state.posts[postIndex] = updatedPost;
            }


            state.posts = [...state.posts].sort((a, b) => b.likes - a.likes);
            
            const updatedIndex = state.posts.findIndex(post => post.id === id)

            state.from = postIndex
            state.to = updatedIndex

        },
        addOwnReaction(state, action: PayloadAction<{ id: number; reaction: string, result: object }>) {
            const { id, reaction } = action.payload;
            const postIndex = state.posts.findIndex(post => post.id === id);

            if (postIndex !== -1) {
                const updatedPost = { ...state.posts[postIndex] };

                if (reaction === "like") {
                    updatedPost.userReaction = 'like';
                } else if (reaction === "dislike") {
                    updatedPost.userReaction = 'dislike';
                }

                state.posts[postIndex] = updatedPost;
            }

        }
    },
});

export const { addPost, setPosts, reactToPost, addOwnReaction } = postSlice.actions;
export default postSlice.reducer;
