import React from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { uiActions } from "../../redux/slices/uiSlice";

type CustomModalProps = React.PropsWithChildren<{
  onClose: () => void;
}>;

const CustomModal = ({ onClose, children }: CustomModalProps): JSX.Element => {
  console.log("render modal");
  const { isOpen } = useAppSelector((state) => state.UI.modal);
  const dispatch = useAppDispatch();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
