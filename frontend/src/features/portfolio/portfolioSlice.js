import { createSlice } from "@reduxjs/toolkit";

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        cash: 0
    },
    reducers: {
        setCash: (state, action) => {
            state.cash = action.payload;
        }
    },
});

export const { setCash } = portfolioSlice.actions;

export const selectCash = state => state.portfolio.cash;

export default portfolioSlice.reducer;