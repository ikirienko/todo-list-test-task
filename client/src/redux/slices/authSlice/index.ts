import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { router } from "../../..";

import { IGetUserResponse, ILoginResponse } from "../../../api/services/types";
import {
  initFetch,
  onFulfilledReducer,
  onPendingReducer,
  onRejectedReducer,
} from "../../reducers";
import { AuthStateDraft, IAuthState, ReducersNames } from "../../types";

import { getUserThunk, loginThunk, logoutThunk } from "./asyncActions";

// @ts-ignore
const initialState: IAuthState = {
  user: null,
  token: localStorage.getItem("token")?.toString() || "",
  login: initFetch,
  logout: initFetch,
  getUser: initFetch,
};

export const authSlice = createSlice({
  name: ReducersNames.AUTH,
  initialState,
  reducers: {
    clearMessage(state, action: PayloadAction<"login">) {
      state[action.payload].message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, onPendingReducer<AuthStateDraft>("login"))
      .addCase(
        loginThunk.fulfilled,
        onFulfilledReducer<AuthStateDraft>(
          "login",
          (state, action: PayloadAction<ILoginResponse>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            router.navigate("/", { replace: true });
          }
        )
      )
      .addCase(loginThunk.rejected, onRejectedReducer<AuthStateDraft>("login"))

      .addCase(logoutThunk.pending, onPendingReducer<AuthStateDraft>("logout"))
      .addCase(
        logoutThunk.fulfilled,
        onFulfilledReducer<AuthStateDraft>("logout", (state) => {
          state.token = "";
          state.user = null;
          localStorage.removeItem("token");
        })
      )
      .addCase(
        logoutThunk.rejected,
        onRejectedReducer<AuthStateDraft>("logout", (state) => {
          state.token = "";
          state.user = null;
          localStorage.removeItem("token");
        })
      )

      .addCase(
        getUserThunk.pending,
        onPendingReducer<AuthStateDraft>("getUser")
      )
      .addCase(
        getUserThunk.fulfilled,
        onFulfilledReducer<AuthStateDraft>(
          "getUser",
          (state, action: PayloadAction<IGetUserResponse>) => {
            state.user = action.payload.user;
          }
        )
      )
      .addCase(
        getUserThunk.rejected,
        onRejectedReducer<AuthStateDraft>("getUser")
      );
  },
});

export const { actions: authActions, reducer: authReducer } = authSlice;
