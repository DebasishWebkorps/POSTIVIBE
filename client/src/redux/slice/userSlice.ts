import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string,
    name: string,
    email: string,
    role: string,
    image: string
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
    },
});

export const { setCurrentUser, logout } = userSlice.actions;

export default userSlice.reducer;
