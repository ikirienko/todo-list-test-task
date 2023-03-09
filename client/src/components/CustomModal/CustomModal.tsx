import React from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { uiActions } from "../../redux/slices/uiSlice";
import styles from "./styles.module.scss";

type CustomModalProps = React.PropsWithChildren<{
  onClose: () => void;
}>;

const CustomModal = ({ onClose, children }: CustomModalProps): JSX.Element => {
  const { isOpen } = useAppSelector((state) => state.UI.modal);
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={isOpen}
      className={styles.container}
      classes={{
        paper: styles.paper,
      }}
    >
      {children}
      <IconButton
        className={styles.close}
        component="span"
        onClick={() => {
          dispatch(uiActions.hideModal());
          onClose();
        }}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
};

export default CustomModal;
