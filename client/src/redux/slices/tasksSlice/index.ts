import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ICreateTaskResponse,
  IGetTasksResponse,
} from "../../../api/services/types";
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  SortBy,
  SortOrder,
} from "../../../constants";

import {
  initDetail,
  initFetch,
  initList,
  onFulfilledReducer,
  onPendingReducer,
  onRejectedReducer,
} from "../../reducers";
import { TasksStateDraft, ITasksState, ReducersNames } from "../../types";
import {
  createTaskThunk,
  deleteTaskThunk,
  getTasksThunk,
  updateTaskThunk,
} from "./asyncActions";

const initialState: ITasksState = {
  // @ts-ignore
  tasksTable: {
    page: 0,
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
    ...initList,
  },
  create: {
    ...initDetail,
  },
  update: {
    selectedTask: null,
    ...initDetail,
  },
  delete: {
    ...initFetch,
  },
};

export const tasksSlice = createSlice({
  name: ReducersNames.TASKS,
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.tasksTable.page = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.tasksTable.sortOrder = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.tasksTable.sortBy = action.payload;
    },
    setSelectedTask(state, action: PayloadAction<number | null>) {
      if (action.payload === null) {
        state.update.selectedTask = null;
      } else {
        state.update.selectedTask =
          state.tasksTable.result.find((task) => task.id === action.payload) ||
          null;
      }
    },
    clearMessage(
      state,
      action: PayloadAction<"tasksTable" | "create" | "update" | "delete">
    ) {
      state[action.payload].message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getTasksThunk.pending,
        onPendingReducer<TasksStateDraft>("tasksTable")
      )
      .addCase(
        getTasksThunk.fulfilled,
        onFulfilledReducer<TasksStateDraft>(
          "tasksTable",
          (state, action: PayloadAction<IGetTasksResponse>) => {
            state.tasksTable.result = action.payload.rows;
            state.tasksTable.count = action.payload.count;
          }
        )
      )
      .addCase(
        getTasksThunk.rejected,
        onRejectedReducer<TasksStateDraft>("tasksTable")
      )

      .addCase(
        createTaskThunk.pending,
        onPendingReducer<TasksStateDraft>("create")
      )
      .addCase(
        createTaskThunk.fulfilled,
        onFulfilledReducer<TasksStateDraft>(
          "create",
          (state, action: PayloadAction<ICreateTaskResponse>) =>
            (state.create.result = action.payload)
        )
      )
      .addCase(
        createTaskThunk.rejected,
        onRejectedReducer<TasksStateDraft>("create")
      )

      .addCase(
        updateTaskThunk.pending,
        onPendingReducer<TasksStateDraft>("update")
      )
      .addCase(
        updateTaskThunk.fulfilled,
        onFulfilledReducer<TasksStateDraft>(
          "update",
          (state, action: PayloadAction<ICreateTaskResponse>) =>
            (state.update.result = action.payload)
        )
      )
      .addCase(
        updateTaskThunk.rejected,
        onRejectedReducer<TasksStateDraft>("update")
      )

      .addCase(
        deleteTaskThunk.pending,
        onPendingReducer<TasksStateDraft>("delete")
      )
      .addCase(
        deleteTaskThunk.fulfilled,
        onFulfilledReducer<TasksStateDraft>("delete")
      )
      .addCase(
        deleteTaskThunk.rejected,
        onRejectedReducer<TasksStateDraft>("delete")
      );
  },
});

export const { actions: tasksActions, reducer: tasksReducer } = tasksSlice;
