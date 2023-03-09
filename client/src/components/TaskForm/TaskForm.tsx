import { useEffect } from "react";
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
import { deleteTaskThunk } from "../../redux/slices/tasksSlice/asyncActions";

const TaskForm = () => {
  const createMessage = useAppSelector((state) => state.TASKS.create.message);
  const updateMessage = useAppSelector((state) => state.TASKS.update.message);
  const { message: deleteMessage, fetching: deletePending } = useAppSelector(
    (state) => state.TASKS.delete
  );
  const message = createMessage || updateMessage || deleteMessage;
  const selectedTask = useAppSelector(
    (state) => state.TASKS.update.selectedTask
  );
  const user = useAppSelector((state) => state.AUTH.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message) {
      toast.error(message);

      dispatch(tasksActions.clearMessage("create"));
      dispatch(tasksActions.clearMessage("update"));
      dispatch(tasksActions.clearMessage("delete"));
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
          {!!selectedTask && (
            <div className={styles["task-form__form__buttons__delete"]}>
              <Button
                color="error"
                type="button"
                disabled={isSubmitting || deletePending}
                onClick={() => {
                  dispatch(deleteTaskThunk(selectedTask.id));
                }}
              >
                Удалить
              </Button>
            </div>
          )}
          <Button
            color="primary"
            type="button"
            disabled={isSubmitting || deletePending}
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
            disabled={isSubmitting || deletePending}
          >
            Создать
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
