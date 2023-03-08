import { FormikHelpers } from "formik";
import * as yup from "yup";
import { ILoginRequest } from "../../api/services/types";

import { loginThunk } from "../../redux/slices/authSlice/asyncActions";
import { store } from "../../redux/store";

export type ILoginFormValues = ILoginRequest;

export const validationSchema = yup.object({
  name: yup.string().trim().required("Введите логин"),
  password: yup.string().trim().required("Введите пароль"),
});

export const handleSubmitLoginForm = async (
  values: ILoginRequest,
  { setSubmitting }: FormikHelpers<ILoginFormValues>
) => {
  await store.dispatch(loginThunk(values));
  setSubmitting(false);
};

export const loginFormInitialValues: ILoginFormValues = {
  name: "",
  password: "",
};
