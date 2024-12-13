import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Content {
    feed: string;
}

interface FeedState {
    feeds: Content[];
}

const initialState: FeedState = {
    feeds: [],
};

const postSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        addFeed(state, action: PayloadAction<Content>) {
            if (state.feeds.length >= 10) state.feeds.pop()
            state.feeds.unshift(action.payload);
        },
        clearFeed(state) {
            return state = {
                feeds: []
            }
        }
    },
});

export const { addFeed, clearFeed } = postSlice.actions;
export default postSlice.reducer;
