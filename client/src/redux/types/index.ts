import { WritableDraft } from "immer/dist/types/types-external";
import { ICreateTaskResponse } from "../../api/services/types";
import { SortBy, SortOrder } from "../../constants";

export const enum ReducersNames {
  AUTH = "AUTH",
  TASKS = "TASKS",
  UI = "UI",
}

export type FetchStatus = {
  fetching: boolean;
  success: boolean;
  message: string | null;
};

export type Detail<T> = {
  result: T | null;
} & FetchStatus;

export type List<T> = {
  result: T[];
} & FetchStatus;

export type StateType = {
  [k: string]: FetchStatus;
};

export interface IUser {
  name: string;
}

export type IAuthState = StateType & {
  user: IUser | null;
  token: string;
  login: FetchStatus;
  logout: FetchStatus;
  getUser: FetchStatus;
};

export type AuthStateDraft = WritableDraft<IAuthState>;

export interface ITask {
  id: number;
  userName: string;
  email: string;
  text: string;
  done: boolean;
  textIsEdited: boolean;
}

export type ITasksState = StateType & {
  tasksTable: {
    count: number;
    page: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
  } & List<ITask>;
  create: Detail<ICreateTaskResponse>;
  update: {
    selectedTask: ITask | null;
  } & Detail<ICreateTaskResponse>;
  delete: FetchStatus;
};

export type TasksStateDraft = WritableDraft<ITasksState>;

export interface IUIState {
  modal: {
    isOpen: boolean;
  };
}
