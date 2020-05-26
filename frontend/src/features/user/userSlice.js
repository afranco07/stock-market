import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        authenticated: false,
        cash: 0,
        loading: true
    },
    reducers: {
        setAuth: (state, action) => {
            state.authenticated = action.payload;
        },
        setCash: (state, action) => {
            state.cash = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setAuth, setCash, setLoading } = userSlice.actions;

export const selectAuth = state => state.user.authenticated;
export const selectCash = state => state.user.cash;
export const isLoading = state => state.user.loading;

export default userSlice.reducer;