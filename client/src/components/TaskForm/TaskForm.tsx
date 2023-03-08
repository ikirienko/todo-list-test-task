import { useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  getHandleSubmitFormOnUpdate,
  handleSubmitFormOnCreate,
  taskFormInitialValues,
  validationSchema,
} from "./utils";

import styles from "./styles.module.scss";
import { uiActions } from "../../redux/slices/uiSlice";
import { tasksActions } from "../../redux/slices/tasksSlice";
import { toast } from "react-toastify";
import { isAdmin } from "../../utils";

const TaskForm = () => {
  console.log("render TaskForm");
  const createMessage = useAppSelector((state) => state.TASKS.create.message);
  const updateMessage = useAppSelector((state) => state.TASKS.update.message);
  const message = createMessage || updateMessage;
  const selectedTask = useAppSelector(
    (state) => state.TASKS.update.selectedTask
  );
  console.log("selectedTask", selectedTask);
  const user = useAppSelector((state) => state.AUTH.user);
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     dispatch(tasksActions.clearMessage("create"));
  //     dispatch(tasksActions.clearMessage("update"));
  //     return () => {
  //       console.log("Clear useEffect TaskForm");
  //       dispatch(tasksActions.clearMessage("create"));
  //       dispatch(tasksActions.clearMessage("update"));
  //     };
  //   }, []);

  useEffect(() => {
    console.log("useEffect TaskForm Message:", message);
    if (message) {
      toast.error(message);

      dispatch(tasksActions.clearMessage("create"));
      dispatch(tasksActions.clearMessage("update"));
    }
  }, [message]);

  const formik = useFormik({
    initialValues: selectedTask
      ? selectedTask
      : { ...taskFormInitialValues, userName: user?.name ?? "" },
    validationSchema: validationSchema,
    onSubmit: selectedTask
      ? getHandleSubmitFormOnUpdate(selectedTask.id)
      : handleSubmitFormOnCreate,
  });

  const { values, errors, touched, isSubmitting } = formik;

  return (
    <div className={styles["task-form"]}>
      <form
        className={styles["task-form__form"]}
        onSubmit={formik.handleSubmit}
      >
        <h2 className={styles["task-form__form__title"]}>
          {selectedTask ? "Редактировать" : "Добавить задачу"}
        </h2>
        <TextField
          variant="outlined"
          fullWidth
          id="userName"
          name="userName"
          label="Имя пользователя"
          value={values.userName}
          onChange={formik.handleChange}
          error={touched && Boolean(errors.userName)}
          helperText={touched.userName && errors.userName}
        />
        <TextField
          variant="outlined"
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={values.email}
          onChange={formik.handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        <TextField
          variant="outlined"
          fullWidth
          id="text"
          name="text"
          label="Текст задачи"
          value={values.text}
          onChange={formik.handleChange}
          error={touched.text && Boolean(errors.text)}
          helperText={touched.text && errors.text}
        />
        {isAdmin(user) && (
          <FormControlLabel
            control={<Checkbox checked={formik.values.done} />}
            label="Выполнено"
            name="done"
            onChange={formik.handleChange}
          />
        )}
        <div className={styles["task-form__form__buttons"]}>
          <Button
            color="primary"
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              dispatch(uiActions.hideModal());
              setTimeout(
                () => dispatch(tasksActions.setSelectedTask(null)),
                200
              );
            }}
          >
            Отмена
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            Создать
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
