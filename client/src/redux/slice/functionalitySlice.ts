import { createSlice } from '@reduxjs/toolkit';

interface Functionality {
    currentPage: number,
    loading: boolean,
    isFetching: boolean,
    isLast: number,
    addPost: boolean,
    mostLikedPost: object[],
    refresh: boolean
}

interface FunctionalityState {
    functionality: Functionality | null;
}

const initialState: FunctionalityState = {
    functionality: {
        currentPage: 1,
        loading: false,
        isFetching: false,
        isLast: null,
        addPost: false,
        mostLikedPost: null,
        refresh: false
    }
};

const functionalitySlice = createSlice({
    name: 'functionality',
    initialState,
    reducers: {
        setCurrentPage: (state) => {
            state.functionality.currentPage = state.functionality.currentPage + 1;
        },
        setLoadingTrue: (state) => {
            state.functionality.loading = true;
        },
        setLoadingFalse: (state) => {
            state.functionality.loading = false;
        },
        setFetchingTrue: (state) => {
            state.functionality.isFetching = true;
        },
        setFetchingFalse: (state) => {
            state.functionality.isFetching = false;
        },
        setIsLast: (state, action) => {
            state.functionality.isLast = action.payload
        },
        setMostLikedPost: (state, action) => {
            state.functionality.mostLikedPost = action.payload
        },
        setAddPostToggle: (state) => {
            state.functionality.addPost = !state.functionality.addPost;
        },
        setRefreshToggle: (state) => {
            state.functionality.refresh = !state.functionality.refresh;
        }
    },
});

export const { setCurrentPage, setLoadingTrue, setLoadingFalse, setFetchingTrue, setFetchingFalse, setIsLast, setMostLikedPost, setAddPostToggle, setRefreshToggle } = functionalitySlice.actions;

export default functionalitySlice.reducer;
