import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import IndexPage from "./pages/index/IndexPage";
import LoginPage from "./pages/login/LoginPage";
import { useAppDispatch } from "./redux/hooks";
import { authActions } from "./redux/slices/authSlice";
import { getUserThunk } from "./redux/slices/authSlice/asyncActions";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  console.log("useEffect App");
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
