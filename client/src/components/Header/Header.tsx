import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutThunk } from "../../redux/slices/authSlice/asyncActions";
import styles from "./styles.module.scss";

const Header = () => {
  const user = useAppSelector((state) => state.AUTH.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles["header__content"]}>
        {user ? (
          <div className={styles["header__content__logged"]}>
            <p>
              Вы вошли как{" "}
              <span className={styles["header__content__logged__login"]}>
                {user.name}
              </span>
            </p>
            <Button onClick={() => dispatch(logoutThunk())}>Выйти</Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/login")}>Войти</Button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default Header;
