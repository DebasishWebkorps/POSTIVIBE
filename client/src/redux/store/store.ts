import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice'
import postReducer from '../slice/postSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer
    },
});


export default store;
export type RootState = ReturnType<typeof store.getState>;

