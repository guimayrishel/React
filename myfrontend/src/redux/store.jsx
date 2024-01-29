// store.js
import { configureStore } from '@reduxjs/toolkit';
import wardsReducer from './wardsSlice';

const store = configureStore({
  reducer: {
    wards: wardsReducer,
  },
});

export default store;
