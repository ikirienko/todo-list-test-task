import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
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
    try {
      const token = (thunkAPI.getState() as RootState).AUTH.token;
      const response = await api.updateTask(values, token);

      if (response.status === 200) {
        if ((thunkAPI.getState() as RootState).UI.modal.isOpen) {
          thunkAPI.dispatch(uiActions.hideModal());
          setTimeout(
            () => thunkAPI.dispatch(tasksActions.setSelectedTask(null)),
            200
          );
          toast.success("Задача изменена");
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
  }
);

export const deleteTaskThunk = createAsyncThunk(
  `${ReducersNames.TASKS}/delete`,
  async (id: number, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).AUTH.token;
      const response = await api.deleteTask(id, token);

      if (response.status === 200) {
        if ((thunkAPI.getState() as RootState).UI.modal.isOpen) {
          thunkAPI.dispatch(uiActions.hideModal());
          setTimeout(
            () => thunkAPI.dispatch(tasksActions.setSelectedTask(null)),
            200
          );
          toast.success("Задача удалена");
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
  }
);
