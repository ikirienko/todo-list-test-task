import { createAsyncThunk } from "@reduxjs/toolkit";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AxiosError, AxiosResponse } from "axios";
import qs from "qs";
import { toast } from "react-toastify";
import { tasksActions } from "..";
import { router } from "../../../..";

import api from "../../../../api/services";
import {
  ICreateTaskRequest,
  IUpdateTaskRequest,
} from "../../../../api/services/types";
import { RootState } from "../../../store";
import { ReducersNames } from "../../../types";
import { logoutThunk } from "../../authSlice/asyncActions";
import { uiActions } from "../../uiSlice";

export const getTasksThunk = createAsyncThunk(
  `${ReducersNames.TASKS}/getTasks`,
  async (_, thunkAPI) => {
    try {
      const { page, sortBy, sortOrder } = (thunkAPI.getState() as RootState)
        .TASKS.tasksTable;

      const response = await api.getTasks(
        qs.stringify({ page, sortBy, sortOrder })
      );
      return response.status === 200
        ? response.data
        : thunkAPI.rejectWithValue(JSON.stringify(response) ?? "Unknown error");
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        (e as AxiosError<{ message: string }>)?.response?.data?.message ??
          e?.message ??
          JSON.stringify(e)
      );
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  `${ReducersNames.TASKS}/create`,
  async (values: ICreateTaskRequest, thunkAPI) => {
    try {
      const response = await api.createTask(values);

      if (response.status === 200) {
        if ((thunkAPI.getState() as RootState).UI.modal.isOpen) {
          thunkAPI.dispatch(uiActions.hideModal());
          toast.success("Задача создана");
        }

        thunkAPI.dispatch(getTasksThunk());
        return response.data;
      }

      return thunkAPI.rejectWithValue(
        JSON.stringify(response) ?? "Unknown error"
      );
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        (e as AxiosError<{ message: string }>)?.response?.data ??
          e?.message ??
          JSON.stringify(e)
      );
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  `${ReducersNames.TASKS}/update`,
  async (values: IUpdateTaskRequest, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).AUTH.token;
    const request = async () => await api.updateTask(values, token);
    return await thunkBodyForAuthorizedRequests(
      request,
      thunkAPI,
      "Задача обновлена"
    );
  }
);

export const deleteTaskThunk = createAsyncThunk(
  `${ReducersNames.TASKS}/delete`,
  async (id: number, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).AUTH.token;
    const request = async () => await api.deleteTask(id, token);
    return await thunkBodyForAuthorizedRequests(
      request,
      thunkAPI,
      "Задача удалена"
    );
  }
);

export const thunkBodyForAuthorizedRequests = async (
  request: () => Promise<AxiosResponse<any>>,
  thunkAPI: BaseThunkAPI<any, any, any, unknown>,
  toastMessage: string
) => {
  try {
    const response = await request();
    if (response.status === 200) {
      if ((thunkAPI.getState() as RootState).UI.modal.isOpen) {
        thunkAPI.dispatch(uiActions.hideModal());
        setTimeout(
          () => thunkAPI.dispatch(tasksActions.setSelectedTask(null)),
          200
        );
        toast.success(toastMessage);
      }

      thunkAPI.dispatch(getTasksThunk());
      return response.data;
    }

    return thunkAPI.rejectWithValue(
      JSON.stringify(response) ?? "Unknown error"
    );
  } catch (e: any) {
    const message =
      (e as AxiosError<{ message: string }>)?.response?.data ??
      e?.message ??
      JSON.stringify(e);

    if (message.toLowerCase().startsWith("unauthorized")) {
      toast.success("Нет доступа к операции");
      thunkAPI.dispatch(logoutThunk());
      router.navigate("/login", { replace: true });
      return thunkAPI.rejectWithValue(null);
    }

    return thunkAPI.rejectWithValue(message);
  }
};
