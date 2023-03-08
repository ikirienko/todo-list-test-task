import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./slices/authSlice";
import { tasksReducer } from "./slices/tasksSlice";
import { uiReducer } from "./slices/uiSlice";
import { ReducersNames } from "./types";

export const store = configureStore({
  reducer: {
    [ReducersNames.AUTH]: authReducer,
    [ReducersNames.TASKS]: tasksReducer,
    [ReducersNames.UI]: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
