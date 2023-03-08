import { Button } from "@mui/material";
import CustomModal from "../../components/CustomModal/CustomModal";
import TaskForm from "../../components/TaskForm/TaskForm";
import TasksTable from "../../components/TasksTable/TasksTable";
import { useAppDispatch } from "../../redux/hooks";
import { tasksActions } from "../../redux/slices/tasksSlice";
import { uiActions } from "../../redux/slices/uiSlice";
import styles from "./styles.module.scss";

const IndexPage = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles["index-page"]}>
      <div className={styles["index-page__button"]}>
        <Button
          variant="outlined"
          onClick={() => dispatch(uiActions.showModal())}
        >
          Добавить задачу
        </Button>
      </div>
      <TasksTable />
      <CustomModal
        onClose={() =>
          setTimeout(() => dispatch(tasksActions.setSelectedTask(null)), 200)
        }
      >
        <TaskForm />
      </CustomModal>
    </div>
  );
};

export default IndexPage;
