import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./redux/hooks";
import { getUserThunk } from "./redux/slices/authSlice/asyncActions";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserThunk());
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      limit={4}
      theme="light"
    />
  );
};

export default App;
