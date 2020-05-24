import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import stocksReducer from '../features/stocks/stocksSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    stocks: stocksReducer
  },
});
