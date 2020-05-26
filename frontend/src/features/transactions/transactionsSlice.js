import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
    },
    reducers: {
        setTransactions: (state, action) => {
            state.transactions = [...action.payload];
        },
    },
});

export const { setTransactions } = transactionSlice.actions;

export const selectTransactions = state => state.transactions.transactions;

export default transactionSlice.reducer;