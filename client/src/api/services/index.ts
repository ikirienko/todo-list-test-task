import { AxiosResponse } from "axios";

import { ITask } from "../../redux/types";
import { apiInstance } from "../index";

import {
  ICreateTaskRequest,
  ICreateTaskResponse,
  IGetTasksResponse,
  ILoginRequest,
  ILoginResponse,
  ILogoutRequest,
  IUpdateTaskRequest,
} from "./types";

const login = async (
  values: ILoginRequest
): Promise<AxiosResponse<ILoginResponse>> =>
  await apiInstance.post("/login", values);

const logout = async (values: ILogoutRequest): Promise<AxiosResponse<any>> =>
  await apiInstance.post("/logout", values);

const getUser = async (token: string): Promise<AxiosResponse<ILoginResponse>> =>
  await apiInstance.get("/auth", {
    headers: {
      Authorization: token,
    },
  });

const getTasks = async (
  qs?: string
): Promise<AxiosResponse<IGetTasksResponse>> =>
  await apiInstance.get(`/tasks?${qs || ""}`);

const createTask = async (
  values: ICreateTaskRequest
): Promise<AxiosResponse<ICreateTaskResponse>> =>
  await apiInstance.post("/tasks", values);

const updateTask = async (
  values: IUpdateTaskRequest,
  token: string
): Promise<AxiosResponse<ICreateTaskResponse>> =>
  await apiInstance.put("/tasks", values, {
    headers: {
      Authorization: token,
    },
  });

const deleteTask = async (
  id: number,
  token: string
): Promise<AxiosResponse<any>> =>
  await apiInstance.delete(`/tasks/${id}`, {
    headers: {
      Authorization: token,
    },
  });

export default {
  login,
  logout,
  getUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
