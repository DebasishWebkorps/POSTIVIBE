import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Content {
    id: number;
    feed: string;
}

interface FeedState {
    id: number
    feeds: Content[];
}

const initialState: FeedState = {
    id: 0,
    feeds: [],
};

const postSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        addFeed(state, action: PayloadAction<Content>) {
            if (state.feeds.length >= 10) state.feeds.pop()
            state.id += 1
            state.feeds.unshift(action.payload);
        },
        clearFeed(state) {
            return state = {
                id: 1,
                feeds: []
            }
        }
    },
});

export const { addFeed, clearFeed } = postSlice.actions;
export default postSlice.reducer;
