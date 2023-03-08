import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../../../api/services";
import { ILoginRequest } from "../../../../api/services/types";
import { RootState } from "../../../store";
import { ReducersNames } from "../../../types";

export const loginThunk = createAsyncThunk(
  `${ReducersNames.AUTH}/login`,
  async (values: ILoginRequest, thunkAPI) => {
    try {
      const response = await api.login(values);
      return response.status === 200
        ? response.data
        : thunkAPI.rejectWithValue(JSON.stringify(response) ?? "Unknown error");
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        (e as AxiosError<{ error: string }>)?.response?.data ??
          e?.message ??
          JSON.stringify(e)
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  `${ReducersNames.AUTH}/logout`,
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).AUTH.token;
      const response = await api.logout({
        token,
      });
      return response.status === 200
        ? response.data
        : thunkAPI.rejectWithValue(JSON.stringify(response) ?? "Unknown error");
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        (e as AxiosError<{ error: string }>)?.response?.data ??
          e?.message ??
          JSON.stringify(e)
      );
    }
  }
);

export const getUserThunk = createAsyncThunk(
  `${ReducersNames.AUTH}/getUser`,
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).AUTH.token;
      const response = await api.getUser(token);
      return response.status === 200
        ? response.data
        : thunkAPI.rejectWithValue(JSON.stringify(response) ?? "Unknown error");
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        (e as AxiosError<{ error: string }>)?.response?.data ??
          e?.message ??
          JSON.stringify(e)
      );
    }
  }
);
