import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    name: string,
    email: string,
    image: string,
    totalPost: number,
    totalLikes: number,
    totalDislikes: number
}

interface UserState {
    currentUser: User | null;
}

const initialState: UserState = {
    currentUser: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        setTotalPosts: (state) => {
            state.currentUser.totalPost += 1;
        },
        setTotalLikesDislikes: (state, action: PayloadAction<{ like: number, dislike: number }>) => {
            state.currentUser.totalLikes = state.currentUser.totalLikes + action.payload.like
            state.currentUser.totalDislikes = state.currentUser.totalDislikes + action.payload.dislike
        }
    },
});

export const { setCurrentUser, logout, setTotalPosts, setTotalLikesDislikes } = userSlice.actions;

export default userSlice.reducer;
