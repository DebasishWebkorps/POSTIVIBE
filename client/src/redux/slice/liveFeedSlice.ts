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
            state.feeds.push(action.payload);
        }
    },
});

export const { addFeed } = postSlice.actions;
export default postSlice.reducer;
