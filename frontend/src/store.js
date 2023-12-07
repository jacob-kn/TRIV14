import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import { apiSlice } from './slices/apiSlice';
import quizReducer from "./slices/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    quizInfo: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
