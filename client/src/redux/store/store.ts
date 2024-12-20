import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice'
import postReducer from '../slice/postSlice'
import feedReducer from '../slice/liveFeedSlice'
import functionalityReducer from '../slice/functionalitySlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer,
        feeds: feedReducer,
        functionality: functionalityReducer
    },
});


export default store;
export type RootState = ReturnType<typeof store.getState>;

