import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice'
import postReducer from '../slice/postSlice'
import feedReducer from '../slice/liveFeedSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer,
        feeds: feedReducer
    },
});


export default store;
export type RootState = ReturnType<typeof store.getState>;

