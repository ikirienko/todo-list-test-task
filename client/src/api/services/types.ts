import { ITask, IUser } from "../../redux/types";

export interface ILoginRequest {
  name: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface ILogoutRequest {
  token: string;
}

export interface IGetUserResponse {
  user: IUser;
}

export interface IGetTasksResponse {
  count: number;
  rows: ITask[];
}

export type ICreateTaskRequest = Pick<ITask, "userName" | "email" | "text">;

export type IUpdateTaskRequest = Partial<Omit<ITask, "id" | "textIsEdited">> &
  Pick<ITask, "id">;

export type ICreateTaskResponse = Pick<ITask, "id">;
