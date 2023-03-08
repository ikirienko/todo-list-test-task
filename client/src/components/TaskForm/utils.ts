import { FormikHelpers } from "formik";
import * as yup from "yup";
import { ICreateTaskRequest } from "../../api/services/types";

import {
  createTaskThunk,
  updateTaskThunk,
} from "../../redux/slices/tasksSlice/asyncActions";
import { store } from "../../redux/store";
import { ITask } from "../../redux/types";

export type ITaskFormValues = Pick<
  ITask,
  "userName" | "email" | "text" | "done"
>;

export const validationSchema = yup.object({
  userName: yup.string().trim().required("Введите имя пользователя"),
  email: yup.string().trim().email().required("Введите email"),
  text: yup.string().trim().required("Введите текст задачи"),
});

export const handleSubmitFormOnCreate = async (
  values: ITaskFormValues,
  { setSubmitting }: FormikHelpers<ITaskFormValues>
) => {
  await store.dispatch(createTaskThunk(values));
  setSubmitting(false);
};

export const getHandleSubmitFormOnUpdate =
  (id: number) =>
  async (
    values: ITaskFormValues,
    { setSubmitting }: FormikHelpers<ITaskFormValues>
  ) => {
    await store.dispatch(updateTaskThunk({ ...values, id }));
    setSubmitting(false);
  };

export const taskFormInitialValues: ITaskFormValues = {
  userName: "",
  email: "",
  text: "",
  done: false,
};
