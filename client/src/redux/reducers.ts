import { PayloadAction } from "@reduxjs/toolkit";

import { FetchStatus, StateType } from "./types";

export const initFetch: FetchStatus = {
  fetching: false,
  success: false,
  message: null,
};

export const initList = {
  result: [],
  ...initFetch,
};

export const initDetail = {
  result: null,
  ...initFetch,
};

export const onPendingReducer =
  <S extends StateType>(
    key: keyof S,
    callback?: (state: S, action: PayloadAction<any>) => void
  ) =>
  (state: S, action: PayloadAction<any>) => {
    state[key].fetching = true;
    state[key].success = false;
    state[key].message = null;
    if (callback) callback(state, action);
  };

export const onRejectedReducer =
  <S extends StateType>(
    key: keyof StateType,
    callback?: (state: S, action: PayloadAction<any>) => void
  ) =>
  (state: S, action: PayloadAction<any, any, any, any>) => {
    state[key].fetching = false;
    state[key].success = false;
    state[key].message = action?.payload;
    if (callback) callback(state, action);
  };

export const onFulfilledReducer =
  <S extends StateType>(
    key: keyof StateType,
    callback?: (state: S, action: PayloadAction<any>) => void
  ) =>
  (state: S, action: PayloadAction<any>) => {
    state[key].fetching = false;
    state[key].success = true;
    state[key].message = null;
    if (callback) callback(state, action);
  };
