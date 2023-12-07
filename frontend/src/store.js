import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./slices/apiSlice";
import quizReducer from "./slices/quizSlice";
import { serverErrorMiddleware } from "./slices/serverErrorMiddleware";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        quizInfo: quizReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(serverErrorMiddleware),
    devTools: true,
});

setupListeners(store.dispatch);
