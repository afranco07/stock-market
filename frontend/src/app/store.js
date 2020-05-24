import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import stocksReducer from '../features/stocks/stocksSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    stocks: stocksReducer,
    transactions: transactionsReducer,
  },
});
