import { useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authActions } from "../../redux/slices/authSlice";

import {
  handleSubmitLoginForm,
  loginFormInitialValues,
  validationSchema,
} from "./utils";

import { toast } from "react-toastify";
import { ErrorMessages } from "../../constants";
import styles from "./styles.module.scss";

const LoginForm = () => {
  const { message } = useAppSelector((state) => state.AUTH.login);
  const user = useAppSelector((state) => state.AUTH.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.clearMessage("login"));
  }, []);

  useEffect(() => {
    if (message) {
      toast.error(ErrorMessages[message.toLowerCase()] || message);
      dispatch(authActions.clearMessage("login"));
    }
  }, [message]);

  const formik = useFormik({
    initialValues: loginFormInitialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmitLoginForm,
  });

  const { values, errors, touched, isSubmitting } = formik;

  return (
    <div className={styles["login-form"]}>
      <form
        className={styles["login-form__form"]}
        onSubmit={formik.handleSubmit}
      >
        <h1 className={styles["login-form__form__title"]}>Войти</h1>
        <TextField
          variant="outlined"
          fullWidth
          id="name"
          name="name"
          label="Логин"
          value={values.name}
          onChange={formik.handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          variant="outlined"
          fullWidth
          id="password"
          name="password"
          label="Пароль"
          type="password"
          value={values.password}
          onChange={formik.handleChange}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
        />
        <div className={styles["login-form__form__buttons"]}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            Войти
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
