import { createSlice } from "@reduxjs/toolkit";

export const stocksSlice = createSlice({
    name: 'stocks',
    initialState: {
        stocks: [],
    },
    reducers: {
        add: (state, action) => {
            state.stocks = [...state.stocks, action.payload];
        },
        setStocks: (state, action) => {
            if (action.payload) {
                state.stocks = [...action.payload];
            }
        },
    },
});

export const { add, setStocks } = stocksSlice.actions;

export const selectStocks = state => state.stocks.stocks;

export default stocksSlice.reducer;