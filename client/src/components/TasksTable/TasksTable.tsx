import React, { useEffect, useState } from "react";
import cn from "classnames";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Checkbox,
  Popover,
} from "@mui/material";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import styles from "./styles.module.scss";
import { tasksActions } from "../../redux/slices/tasksSlice";
import {
  getTasksThunk,
  updateTaskThunk,
} from "../../redux/slices/tasksSlice/asyncActions";
import {
  DEFAULT_SORT_ORDER,
  ROWS_PER_PAGE,
  SortBy,
  SortOrder,
} from "../../constants";
import { uiActions } from "../../redux/slices/uiSlice";
import { toast } from "react-toastify";
import { isAdmin } from "../../utils";

interface ITableHeadCell {
  id: SortBy;
  name: string;
  props: {
    [key: string]: unknown;
  };
}

const TableHeadCellList: ITableHeadCell[] = [
  {
    id: SortBy.USER_NAME,
    name: "Имя пользователя",
    props: {
      style: {
        width: "20%",
      },
    },
  },
  {
    id: SortBy.EMAIL,
    name: "Email",
    props: {
      style: {
        width: "20%",
      },
    },
  },
  {
    id: SortBy.TEXT,
    name: "Текст задачи",
    props: {
      style: {
        width: "30%",
      },
    },
  },
  {
    id: SortBy.DONE,
    name: "Статус",
    props: {
      // align: "center",
      style: {
        width: "10%",
      },
    },
  },
];

const TasksTable = () => {
  console.log("render TasksTable");
  const {
    result: tasks,
    message: tasksTableMessage,
    fetching,
    count,
    page,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.TASKS.tasksTable);
  const updateMessage = useAppSelector((state) => state.TASKS.update.message);
  const message = tasksTableMessage || updateMessage;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const user = useAppSelector((state) => state.AUTH.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("useEffect TasksTable");
    dispatch(getTasksThunk());
  }, []);

  useEffect(() => {
    console.log("useEffect TasksTable Message", message);
    if (message) {
      toast.error(message);
      dispatch(tasksActions.clearMessage("tasksTable"));
      dispatch(tasksActions.clearMessage("update"));
    }
  }, [message]);

  const handleSortClick = (id: SortBy) => {
    if (sortBy === id) {
      const newSortOrder =
        sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      dispatch(tasksActions.setSortOrder(newSortOrder));
    } else {
      dispatch(tasksActions.setSortBy(id));
    }
    dispatch(getTasksThunk());
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(tasksActions.setPage(newPage));
    dispatch(getTasksThunk());
  };

  const handleCheckBox = (id: number, done: boolean) => {
    dispatch(
      updateTaskThunk({
        id,
        done: !done,
      })
    );
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.countriesTable}>
      <TableContainer
        id="tableContainer"
        className={styles["tasksTable__container"]}
        component={Paper}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          className={styles["tasksTable__container__table"]}
        >
          <TableHead className={styles["tasksTable__container__table__head"]}>
            <TableRow>
              {TableHeadCellList.map(({ id, name, props }) => (
                <TableCell
                  key={id}
                  // align="center"
                  sortDirection={sortBy === id ? sortOrder : DEFAULT_SORT_ORDER}
                  {...props}
                >
                  <TableSortLabel
                    active={sortBy === id}
                    direction={sortBy === id ? sortOrder : DEFAULT_SORT_ORDER}
                    onClick={() => handleSortClick(id)}
                  >
                    {name}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={styles["tasksTable__container__table__body"]}>
            {tasks.map(
              ({ id, userName, email, text, done, textIsEdited }, index) => (
                <TableRow
                  className={cn({
                    [styles["tasksTable__container__table__body__row"]]: true,
                    [styles["tasksTable__container__table__body__row__update"]]:
                      isAdmin(user),
                  })}
                  key={id}
                  onClick={
                    isAdmin(user)
                      ? (e) => {
                          dispatch(tasksActions.setSelectedTask(id));
                          dispatch(uiActions.showModal());
                          e.stopPropagation();
                        }
                      : () => {}
                  }
                >
                  <TableCell
                    className={
                      styles["tasksTable__container__table__body__row__cell"]
                    }
                  >
                    {userName}
                  </TableCell>
                  <TableCell
                    className={`${styles["tasksTable__container__table__body__row__cell"]} ${styles["countryName"]}`}
                  >
                    {email}
                  </TableCell>
                  <TableCell
                    className={
                      styles["tasksTable__container__table__body__row__cell"]
                    }
                  >
                    {text}
                  </TableCell>
                  <TableCell
                    className={
                      styles["tasksTable__container__table__body__row__cell"]
                    }
                    align="center"
                  >
                    <div className={styles["tasksTable__status"]}>
                      <Checkbox
                        disabled={!isAdmin(user)}
                        checked={done}
                        onClick={(e) => {
                          handleCheckBox(id, done);
                          e.stopPropagation();
                        }}
                      />
                      {isAdmin(user) && textIsEdited && (
                        <div
                          className={styles["tasksTable__status__edited-icon"]}
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                        >
                          <OutlinedFlagRoundedIcon />
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
            {fetching && (
              <TableRow key="row-spinner">
                <TableCell colSpan={4}>
                  <div className={styles["tasksTable__spinnerContainer"]}>
                    <CircularProgress />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        component="div"
        count={count || 0}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onPageChange={handleChangePage}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={styles["tasksTable__popover"]}>
          Oтредактировано администратором
        </div>
      </Popover>
    </div>
  );
};

export default TasksTable;
